<?php

namespace AppBundle\Course;

use AppBundle\Entity\CourseData;
use AppBundle\Entity\Faq;
use AppBundle\Entity\Page;
use AppBundle\Entity\Question;
use AppBundle\Entity\Session;
use AppBundle\Entity\SessionPageView;
use AppBundle\Form\SessionType;
use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use Exception;
use Sonata\SeoBundle\Seo\SeoPage;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session as HTTPSession;
use Symfony\Component\Routing\RouterInterface;

class SessionManager
{
    private $em;
    /** @var Session|null */
    private $session;
    private $_session;
    private $current_page;
    private $router;
    private $max_pages_remain = 0;
    private $seoPage;
    private $templating;
    private $formFactory;

    public function __construct(
        EntityManager $em,
        RouterInterface $router,
        SeoPage $seoPage,
        HTTPSession $_session,
        TwigEngine $templating,
        FormFactory $formFactory
    )
    {
        $this->em = $em;
        $this->router = $router;
        $this->seoPage = $seoPage;
        $this->_session = $_session;
        $this->templating = $templating;
        $this->formFactory = $formFactory;
    }

    public function setSession(Session $session)
    {
        $this->session = $session;

        if (null !== $this->session->getLastPage() && $this->session->getLastPage()->getLive()) { // Check for the last page id that was viewed to continue
            // Find the last page and return if it still exists and is available
            $this->current_page = $this->session->getLastPage();
        } else {
            $this->current_page = $this->findPage($this->session->getSession(), null);
            $this->em->flush();
        }

        return $this;
    }

    public function getSession()
    {
        return $this->session;
    }

    public function isValidQuestion(Question $question = null): bool
    {
        $questionExists = null !== $question;
        if ($questionExists) {
            $variableExists = null !== $question->getVariable() && '' !== $question->getVariable();
            return $variableExists;
        }
        return false;
    }

    public function getCurrentPage()
    {
        return $this->current_page;
    }

    public function getPageTitle(Page $page)
    {
        $titles = [
            'Introduction',
            'Your Quit Date',
            'First Week Smoke-Free',
            'Second Week Smoke-Free',
            'Third Week Smoke-Free',
            'Fourth Week Smoke-Free',
            'Fifth Week Smoke-Free',
            'The Final Stretch'
        ];
        $sessionNumber = $page->getSession();
        return $titles[$sessionNumber-1] ?? 'Session ' . $sessionNumber;
    }

    public function setNextPage()
    {
        $NextPage = $this->findPage($this->session->getSession(), $this->current_page);
        if (null === $NextPage) {
            $this->session->setLastPage(null);
            $this->session->setCompleted(true);
            $this->em->flush();
            return new RedirectResponse($this->router->generate('account_dashboard'));
        } else {
            $this->session->setLastPage($NextPage);
            $this->em->flush();
            return new RedirectResponse($this->router->generate('account_session'));
        }
    }

    public function recordPageView()
    {
        $SessionView = $this->em->getRepository(SessionPageView::class)
            ->findOneBy(
                [
                    'course' => $this->session->getCourse(),
                    'session' => $this->session,
                    'page_viewed' => $this->current_page
                ]
            );
        if (null === $SessionView) {
            // create the row
            $SessionView = new SessionPageView();
            $SessionView->setCourse($this->session->getCourse());
            $SessionView->setSession($this->session);
            $SessionView->setPageViewed($this->current_page);
            $SessionView->setViews(1);
            $this->em->persist($SessionView);
        } else {
            $SessionView->setViews($SessionView->getViews() + 1);
        }
        $this->session->setLastPage($this->current_page);

        //This updating database prematurely with CourseData which is modified after this...
        $this->em->flush();

        $this->getSessionProgress();
    }

    public function getSessionProgress()
    {
        // This includes the page we are on by now
        // We are probably admin (or there is a bug) if views are 0 - find how many parents there are to current page.
        $TotalPagesViewed = \count($this->session->getViews());
        if ($TotalPagesViewed === 0) {
            $current = $this->current_page;
            while ($current->getParent() !== null) {
                $current = $current->getParent();
                $TotalPagesViewed++;
            }
        }
        $TotalPagesViewed -= 0.5;

        $children[$this->current_page->getId()] = $this->getChildren($this->current_page);

        $MaxTotalPages = $this->max_pages_remain + $TotalPagesViewed + 0.5;

        $PercViewed = !$MaxTotalPages ? 0.5 : round(($TotalPagesViewed / $MaxTotalPages) * 100, 2);
        return $PercViewed;
    }

    public function addFlash($cat, $msg)
    {
        $this->_session->getFlashBag()->add(
            $cat,
            $msg
        );
    }

    /**
     * @param Request $request
     * @param int|null $pageID
     * @return RedirectResponse|Response
     * @throws \InvalidArgumentException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Twig\Error\Error
     */
    public function sessionPageAction(Request $request, int $pageID = null)
    {
        $quitPlan = [];
        if (!$pageID) {
            $preview = false;
            $page = $this->getCurrentPage();
            $quitPlanQuestions = $this->em->getRepository(Question::class)->findBy(['quit_plan' => true]);
            $variables = array_map(
                function (Question $question) {
                    return $question->getVariable();
                }, $quitPlanQuestions
            );
            $courseData = $this->em
                ->getRepository(CourseData::class)
                ->findByCourseAndVariables($this->session->getCourse(), $variables);
            $dataWithKeys = [];
            foreach ($courseData as $datum)
            {
                $dataWithKeys[$datum->getVar()] = $datum;
            }
            foreach ($quitPlanQuestions as $question)
            {
                if (isset($dataWithKeys[$question->getVariable()])) {
                    /** @var CourseData $courseDataItem */
                    $courseDataItem = $dataWithKeys[$question->getVariable()];
                    $quitPlan[] = [
                        'question' => $question,
                        'answer' => $this->convertDataToHumanReadable($courseDataItem)
                    ];
                }
            }
        } else {
            $preview = true;
            $page = $this->em->getRepository(Page::class)
                ->findOneBy(
                    [
                        'id' => $pageID
                    ]
                );
            $this->current_page = $page;
            if (!$page) {
                $this->_session->getFlashBag()->add(
                    'danger',
                    'Sorry, that page was not found in the database.'
                );
                return new RedirectResponse($this->router->generate('admin_manage_view'));
            }

            if (!$page->getLive()) {
                $this->_session->getFlashBag()->add(
                    'warning',
                    'Preview of a DRAFT page'
                );
            } else {
                $this->_session->getFlashBag()->add(
                    'success',
                    'Preview of a LIVE page'
                );
            }
        }

        if ($page === null) {
            // No page available, return user to dashboard
            $this->_session->getFlashBag()->add(
                'warning',
                'Sorry, there are no live pages we can show right now.'
            );
            return new RedirectResponse($this->router->generate('account_dashboard'));
        }

        // Vars used multiple times
        // For the top of the page
        $page_title = $this->getPageTitle($page);
        // Session number
        $session_number = $page->getSession();
        // Header on the text area
        $page_name = $page->getName();

        // Set title tag
        $this->seoPage->setTitle(sprintf('Session %d, %s - %s - %s', $session_number, $page_title, $page_name, $this->seoPage->getTitle()));

        // Get the question for the page
        $questions = $page->getQuestions();
        /** @var Question $question */
        $question = $questions[0];
        // If the question variable name is set
        if ($this->isValidQuestion($question)) {
            // Find CourseData Entity
            $CourseData = $this->em->getRepository(CourseData::class)
                ->findOneBy(
                    [
                        'course' => $this->session->getCourse(),
                        'var' => $question->getVariable()
                    ]
                );
            // Create CourseData Entity if it doesn't exist
            if (null === $CourseData) {
                $CourseData = new CourseData($question);
                $CourseData->setCourse($this->session->getCourse());
            } else {
                $CourseData->setQuestion($question);
            }

            // Create the form
            $form = $this->formFactory->create(
                SessionType::class,
                $CourseData,
                [
                    'attr' => ['id' => 'session_form'],
                    'question' => $question
                ]
            );

            $form->handleRequest($request);
            if ($form->isSubmitted()) {
                if ($form->isValid()) {
                    if ($preview) {
                        return new RedirectResponse($this->router->generate('admin_manage_view'));
                    }
                    /** @var CourseData $CourseData */
                    $CourseData = $form->getData();
                    $CourseData->setDisplayText($question->getDisplayTextForAnswerValue($CourseData->getValue()));
                    $this->em->persist($CourseData);
                    $this->em->flush();
                    if ($question->getInputType() === 'choice_boolean_reset' && $CourseData->getValue() === 'bool_1') {
                        return new RedirectResponse($this->router->generate('account_restart'));
                    }

                    // Update last_page variable to the next page that should be shown.
                    // This function wil flush too, but need to flush data first for next page function to use it if necessary
                    return $this->setNextPage();
                }

                $this->em->detach($CourseData);
                foreach ($form->getErrors(true) as $error) {
                    $this->_session->getFlashBag()->add(
                        'danger',
                        $error->getMessage()
                    );
                }
                return new RedirectResponse($this->router->generate('account_session'));
            }
        } else {
            $form = null;
        }

        if (!$preview) {
            $this->recordPageView();
        }

        // Render page with variables
        return new Response(
            $this->templating->render(
                '@App/Account/session.html.twig',
                [
                    'session_number' => $session_number,
                    'name' => $page_name,
                    'media_type' => $page->getMediaType(),
                    'image_path' => $page->getImagePath(),
                    'video_url' => $page->getVideoUrl(),
                    'text' => $this->loadVariables($page->getText()),
                    'question_type' => null === $question ? null : $question->getInputType(),
                    'answers' => null === $question ? null : $question->getAnswerOptions(),
                    'title' => $page_title,
                    'form' => null === $form ? null : $form->createView(),
                    'session_progress_percent' => $this->getSessionProgress(),
                    'preview' => $preview,
                    'quit_plan' => $quitPlan,
                    'faqs' => $this->em->getRepository(Faq::class)->findBy([], ['sortOrder' => 'ASC'])
                ]
            )
        );
    }

    private function loadVariables(?string $text)
    {
        if (!$text) {
            return '';
        }
        return preg_replace_callback(
            '/{{\s?(.+)\s?}}/i', function ($matches) {
            $data = $this->getData($matches[1]);
            $readable = $this->convertDataToHumanReadable($data);
            if (\is_array($readable)) {
                $html = '<ul>';
                foreach($readable as $item)
                {
                    $html .= sprintf('<li>%s</li>', $item);
                }
                $html .= '<ul>';
                return $html;
            }
            return $readable;
        }, $text
        );
    }

    /**
     * @param CourseData $data
     * @param null $value
     * @return array|bool|string
     */
    private function convertDataToHumanReadable(CourseData $data, $value = null)
    {
        if (!$value) {
            $value = $data->getDisplayText();
        }
        if (\is_array($value)) {
            $newData = [];
            foreach($value as $childValue) {
                $newData[] = $this->convertDataToHumanReadable($data, $childValue);
            }
            return $newData;
        }
        $newData = $this->convertBoolData($value);
        if (\is_bool($newData)) {
            return $newData ? 'Yes' : 'No';
        }
        $datePrefix = 'date';
        if ($newData && strpos($data->getInputType(), $datePrefix) === 0) {
            try {
                $newData = (new DateTimeImmutable($newData))->format('dS F Y');
            } catch (Exception $e) {
            }
        }
        return $newData;
    }

    private function getChildren(Page $page, $parentIds = [], $depth = 0)
    {
        if (!$page->getLive()) {
            return [];
        }

        $parentIds[] = $page->getId();
        $children = [];
        if ($depth > $this->max_pages_remain) {
            $this->max_pages_remain = $depth;
        }
        if ($page->getType() === 'page') {
            foreach ($page->getChildren() as $child) {
                if ($child->getType() === 'page') {
                    $key = $child->getId();
                    // check if page ID already visited in parents (linear)
                    if (\in_array($child->getId(), $parentIds, true)) {
                        $children[$key] = [];
                    } else {
                        $children[$key] = $this->getChildren($child, $parentIds, $depth + 1);
                    }
                } else {
                    $linked_child = $child->getForwardToPage();
                    $key = 'l_' . $linked_child->getId();

                    // check if page ID already visited in parents (linear)
                    if (\in_array($linked_child->getId(), $parentIds, true)) {
                        $children[$key] = [];
                    } else {
                        $children[$key] = $this->getChildren($linked_child, $parentIds, $depth + 1);
                    }
                }
            }
        }

        return $children;
    }

    private function findPage(int $week, Page $parent_page = null)
    {
        $pages = $this->em->getRepository(Page::class)
            ->findBy(
                [
                    'live' => true,
                    'session' => $week,
                    'parent' => ($parent_page === null) ? null : $parent_page->getId()
                ],
                [
                    'sort' => 'ASC'
                ]
            );

        // Loop through possible pages until conditions match
        foreach ($pages as $page) {
            if ($page->getType() === 'link' && null === $page->getForwardToPage()) {
                continue;
            }
            if ($this->checkPageConditions($page)) {
                // check if it's a 'Go To'
                if ($page->getType() === 'link') {
                    // We may be trying to be forwarded to a page that isn't live - we don't want that, skip the goto if that's the case
                    $GoToPage = $page->getForwardToPage();
                    if (!$GoToPage->getLive()) {
                        continue;
                    }
                    return $GoToPage;
                }
                return $page;
            }
        }
        return null;
    }

    /**
     * Checks conditions assigned to page against current course data variables
     * @param  Page $page Page entity to check
     * @return boolean - if all conditions are met, or true if no conditions specified
     */
    private function checkPageConditions(Page $page)
    {
        if (0 === \count($page->getConditions())) {
            return true;
        }

        // All conditions must match for this function to return true
        foreach ($page->getConditions() as $condition) {
            // Statement - variable, operator, value
            // ([A-Za-z0-9_-](\<|\>|\<=|\>=|=).*)
            // /^(([a-z0-9_-]+)([\<|\>|\<=|\>=|=])(.+)|([a-z0-9_-]+))$/i

            // e.g. var=123
            if (preg_match("/^([a-z0-9_-]+ ?)(\<=|\>=|==|!=|\<\>|\<|\>|=)(.+)$/i", $condition->getCondition(), $re_matches)) {
                // the condition can be evaluated - variable, operator, value
                $var = trim($re_matches[1]);
                $op = trim($re_matches[2]);
                $val = trim($re_matches[3]);
                $data = $this->getData($var);

                // Do comparisons where we will return false if condition not matched
                switch ($op) {
                    case '<':
                        if ((float)$data >= (float)$val) {
                            return false;
                        }
                        break;

                    case '>':
                        if ((float)$data <= (float)$val) {
                            return false;
                        }
                        break;

                    case '<=':
                        if ((float)$data > (float)$val) {
                            return false;
                        }
                        break;

                    case '>=':
                        if ((float)$data < (float)$val) {
                            return false;
                        }
                        break;
                    case '!=':
                    case '<>':
                        if ($data == $val) {
                            return false;
                        }
                        break;
                    case '=':
                    case '==':
                        if ($data != $val) {
                            return false;
                        }
                        break;
                }
            } // e.g. var (variable exists and not null or false)
            elseif (preg_match('/^(!?[a-z0-9_-]+ ?)$/i', $condition->getCondition(), $re_matches)) {
                //the condition can be evaluated, does a variable exist
                $neg = $condition->getCondition()[0] === '!';
                $var = $re_matches[1];
                if ($neg) {
                    $var = substr($var, 1);
                }
                $data = $this->getData($var);
                return $neg ? !$data : $data;
            }
        }

        return true;
    }

    /**
     * @param string $value
     * @return bool|string
     */
    public function convertBoolData(string $value)
    {
        $boolPrefix = 0 === strpos($value, 'bool_');
        if ($boolPrefix) {
            return (bool)substr($value, 5);
        }
        return $value;
    }

    public function getData($key)
    {
        // find the variable by key for the course in the database
        $dataEntity = $this->em
            ->getRepository(CourseData::class)
            ->findOneBy(
                [
                    'var' => $key,
                    'course' => $this->session->getCourse()
                ]
            );
        if (!$dataEntity) {
            return null;
        }
        return $this->convertBoolData($dataEntity->getValue());
    }
}
