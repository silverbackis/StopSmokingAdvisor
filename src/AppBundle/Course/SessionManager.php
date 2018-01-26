<?php

namespace AppBundle\Course;

use AppBundle\Entity\CourseData;
use AppBundle\Entity\Page;
use AppBundle\Entity\Question;
use AppBundle\Entity\Session;
use AppBundle\Entity\SessionPageView;
use AppBundle\Form\SessionType;
use Doctrine\ORM\EntityManager;
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
    private $session = null;
    private $_session;
    private $current_page = false;
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

        if (null !== $this->session->getLastPage() && $this->session->getLastPage()->getLive()) // Check for the last page id that was viewed to continue
        {
            // Find the last page and return if it still exists and is available
            $this->current_page = $this->session->getLastPage();
        } else {
            $this->current_page = $this->findPage($this->session->getSession(), null);
            $this->em->flush();
        }

        return $this;
    }

    public function getSession(Session $session)
    {
        return $this->session;
    }

    public function isValidQuestion(Question $question = null)
    {
        return null !== $question && null !== $question->getVariable() && "" !== $question->getVariable();
    }

    public function getCurrentPage()
    {
        return $this->current_page;
    }

    public function getPageTitle(Page $page)
    {
        $sessionNumber = $page->getSession();
        switch ($sessionNumber) {
            case 1:
                return 'Introduction';
                break;

            case 5:
                return 'The Final Stretch - Week 4';
                break;

            case 6:
                return 'Well Done - Keep It Up!';
                break;

            default:
                return 'SmokeFree Week ' . ($sessionNumber - 1);
                break;
        }
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
        $SessionView = $this->em->getRepository('AppBundle\Entity\SessionPageView')
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

        return;
    }

    public function getSessionProgress()
    {
        // This includes the page we are on by now
        // We are probably admin (or there is a bug) if views are 0 - find how many parents there are to current page.
        $TotalPagesViewed = count($this->session->getViews());
        if ($TotalPagesViewed == 0) {
            $current = $this->current_page;
            while ($current->getParent() !== null) {
                $current = $current->getParent();
                $TotalPagesViewed++;
            }
        }
        $TotalPagesViewed -= 0.5;

        $children[$this->current_page->getId()] = $this->getChildren($this->current_page);

        $MaxTotalPages = $this->max_pages_remain + $TotalPagesViewed + 0.5;

        $PercViewed = round(($TotalPagesViewed / $MaxTotalPages) * 100, 2);
        return $PercViewed;
    }

    public function addFlash($cat, $msg)
    {
        $this->_session->getFlashBag()->add(
            $cat,
            $msg
        );
    }

    public function sessionPageAction(Request $request, int $pageID = null)
    {
        if ($pageID) {
            $preview = true;

            $page = $this->em->getRepository('AppBundle\Entity\Page')
                ->findOneBy(
                    [
                        'id' => $pageID
                    ]
                );
            $this->current_page = $page;
            if (!$page) {
                $this->_session->getFlashBag()->add(
                    'danger',
                    "Sorry, that page was not found in the database."
                );
                return new RedirectResponse($this->router->generate('admin_manage_view'));
            }

            if (!$page->getLive()) {
                $this->_session->getFlashBag()->add(
                    'warning',
                    "Preview of a DRAFT page"
                );
            } else {
                $this->_session->getFlashBag()->add(
                    'success',
                    "Preview of a LIVE page"
                );
            }
        } else {
            $preview = false;
            $page = $this->getCurrentPage();
        }

        if ($page === null) {
            // No page available, return user to dashboard
            $this->_session->getFlashBag()->add(
                'warning',
                "Sorry, there are no live pages we can show right now."
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
        $this->seoPage->setTitle("Session " . $session_number . ", " . $page_title . " - " . $page_name . " - " . $this->seoPage->getTitle());

        // Get the question for the page
        $questions = $page->getQuestions();
        $question = $questions[0];
        // If the quesiton variable name is set
        if ($this->isValidQuestion($question)) {
            // Find CourseData Entity
            $CourseData = $this->em->getRepository('AppBundle\Entity\CourseData')
                ->findOneBy(
                    [
                        'course' => $this->session->getCourse(),
                        'var' => $question->getVariable()
                    ]
                );
            // Create CourseData Entity if it doesn't exist
            if (null === $CourseData) {
                $CourseData = new CourseData();
                $CourseData->setCourse($this->session->getCourse());
                $CourseData->setVar($question->getVariable());
            }

            // Create the form
            $form = $this->formFactory->create(
                SessionType::class, $CourseData, [
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

                    $this->em->persist($CourseData);
                    $this->em->flush();

                    // Update last_page variable to the next page that should be shown.
                    // This function wil flush too, but need to flush data first for next page function to use it if necessary
                    return $this->setNextPage();
                } else {
                    $this->em->detach($CourseData);
                    foreach ($form->getErrors(true) as $error) {
                        $this->_session->getFlashBag()->add(
                            'danger',
                            $error->getMessage()
                        );
                    }
                    return new RedirectResponse($this->router->generate('account_session'));
                }
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
                '@App/Account/session.html.twig', [
                'session_number' => $session_number,
                'name' => $page_name,
                'media_type' => $page->getMediaType(),
                'image_path' => $page->getImagePath(),
                'video_url' => $page->getVideoUrl(),
                'text' => $page->getText(),
                'question_type' => null === $question ? null : $question->getInputType(),
                'answers' => null === $question ? null : $question->getAnswerOptions(),
                'title' => $page_title,
                'form' => null === $form ? null : $form->createView(),
                'session_progress_percent' => $this->getSessionProgress(),
                'preview' => $preview
            ]
            )
        );
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
                    if (in_array($child->getId(), $parentIds)) {
                        $children[$key] = [];
                    } else {
                        $children[$key] = $this->getChildren($child, $parentIds, $depth + 1);
                    }
                } else {
                    $linked_child = $child->getForwardToPage();
                    $key = 'l_' . $linked_child->getId();

                    // check if page ID already visited in parents (linear)
                    if (in_array($linked_child->getId(), $parentIds)) {
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
        $pages = $this->em->getRepository('AppBundle:Page')
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
                } else {
                    return $page;
                }
                break;
            }
        }
    }

    /**
     * Checks conditions assigned to page against current course data variables
     * @param  Page $page Page entity to check
     * @return boolean - if all conditions are met, or true if no conditions specified
     */
    private function checkPageConditions(Page $page)
    {
        if (0 === count($page->getConditions())) {
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
                    case "<":
                        if ((float)$data >= (float)$val) {
                            return false;
                        }
                        break;

                    case ">":
                        if ((float)$data <= (float)$val) {
                            return false;
                        }
                        break;

                    case "<=":
                        if ((float)$data > (float)$val) {
                            return false;
                        }
                        break;

                    case ">=":
                        if ((float)$data < (float)$val) {
                            return false;
                        }
                        break;
                    case "!=":
                    case "<>":
                        if ($data == $val) {
                            return false;
                        }
                        break;
                    case "=":
                    case "==":
                        if ($data != $val) {
                            return false;
                        }
                        break;
                }
            } // e.g. var (variable exists and not null or false)
            elseif (preg_match("/^(!?[a-z0-9_-]+ ?)$/i", $condition->getCondition(), $re_matches)) {
                //the condition can be evaluated, does a variable exist
                $neg = substr($condition->getCondition(), 0, 1) === '!';
                $var = $re_matches[1];
                if ($neg) {
                    $var = substr($var, 1);
                }
                if ($this->getData($var)) {
                    return !$neg;
                }
            }
        }

        return true;
    }

    public function convertBoolData (string $value)
    {
        $boolPrefix = substr($value, 0, 5) === 'bool_';
        if ($boolPrefix) {
            $value = !!substr($value, 5);
        }
        return $value;
    }

    public function getData($key)
    {
        // find the variable by key for the course in the database
        $dataEntity = $this->em
            ->getRepository('AppBundle:CourseData')
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