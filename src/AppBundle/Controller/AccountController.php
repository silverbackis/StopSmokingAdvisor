<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Entity\CourseData;
use AppBundle\Entity\Question;
use AppBundle\Entity\UserSettings;
use AppBundle\Form\SessionType;

class AccountController extends Controller
{
    /**
     * @Route("/dashboard", name="account_dashboard")
     */
    public function dashboardAction(Request $request)
    {
        $seoPage = $this->container->get('sonata.seo.page');
        $seoPage->setTitle("Dashboard - ".$seoPage->getTitle());

        $session_manager = $this->container->get('app.session_manager');
        $UserSettings = $this->getUserSettings();

        return $this->render('@App/Account/dashboard.html.twig', [
            'session_available' => $session_manager->getSessionAvailability()->isAvailable(),
            'session_expired' => $session_manager->getSessionAvailability()->isExpired(),
            'session_expired_date' => $session_manager->getSessionAvailability()->getExpire()->format("l jS F Y"),
            'session_started' => count($session_manager->getSession()->getViews()) > 0,
            'session_number' => $session_manager->getSession()->getSession(),
            'session_available_date' => $session_manager->getSessionAvailability()->getAvailable()->format("l jS F"),
            'reminder_emails' => $UserSettings->getReminderEmails()
        ]);
    }

    /**
     * @Route("/settings", name="account_settings")
     */
    public function settingsAction(Request $request)
    {
        return $this->redirectToRoute('account_dashboard', ['_fragment' => 'no_settings_page_made']);
    }
    
    /**
     * @Route("/restart", name="account_restart")
     */
    public function restartAction(Request $request)
    {
        $session_manager = $this->container->get('app.session_manager');
        $session_manager->getCourseManager()->createNewCourse();
        return $this->redirectToRoute('account_dashboard', ['_fragment' => 'restarted']);
    }

    private function getUserSettings()
    {
        $em = $this->getDoctrine()->getManager();
        $UserSettings = $em->getRepository('AppBundle\Entity\UserSettings')
            ->findOneBy([
                'user' => $this->get('security.token_storage')->getToken()->getUser()
            ]);

        // Setup settings if not already there
        if(null === $UserSettings)
        {
            $UserSettings = new UserSettings();
            $UserSettings->setUser($this->get('security.token_storage')->getToken()->getUser());
            $em->persist($UserSettings);
            $em->flush();
        }
        return $UserSettings;
    }

    /**
     * @Route("/session/next", name="account_session_next")
     */
    public function sessionActionNext(Request $request)
    {
        // The current page must have no question requirements
        $session_manager = $this->container->get('app.session_manager');
        $page = $session_manager->getCurrentPage();
        $questions = $page->getQuestions();
        $question = $questions[0];
        if($this->isQuestionPresent($question))
        {
            $this->addFlash(
                'danger',
                'Please answer the question before proceeding'
            );
            return $this->redirectToRoute('account_session');
        }

        // If we get here, we can proceed to next page
        return $session_manager->setNextPage();
    }

    private function isQuestionPresent(Question $question = null)
    {
        return null !== $question && null !== $question->getVariable() && "" !== $question->getVariable();
    }

    /**
     * @Route("/session", name="account_session")
     */
    public function sessionAction(Request $request)
    {
        /*$this->addFlash(
            'warning',
            'You\'re ugly'
        );
        $this->addFlash(
            'danger',
            'You may hurt someone just by looking at them'
        );
        $this->addFlash(
            'success',
            'Plastic surgery can help!'
        );*/

        $session_manager = $this->container->get('app.session_manager');
        $seoPage = $this->container->get('sonata.seo.page');
        
        $em = $this->getDoctrine()->getManager();
        $page = $session_manager->getCurrentPage();

        // Check if session page has been set
        if($page === false)
        {
            // No page available, return user to dashboard
            //$request->getSession()->getFlashBag()->add('notice', "Sorry, it doesn't look like you have any sessions available at the moment.");
            $this->addFlash(
                'warning',
                "Sorry, it doesn't look like you have any sessions available at the moment."
            );
            return $this->redirectToRoute('account_dashboard');
        }

        if($page === null)
        {
            // No page available, return user to dashboard
            //$request->getSession()->getFlashBag()->add('notice', "Sorry, it doesn't look like you have any sessions available at the moment.");
            $this->addFlash(
                'warning',
                "Sorry, there are no live pages we can show right now."
            );
            return $this->redirectToRoute('account_dashboard');
        }

        // Vars used multiple times
        // For the top of the page
        $page_title = $session_manager->getPageTitle($page);
        // Session number
        $session_number = $page->getSession();
        // Header on the text area
        $page_name = $page->getName();

        // Set title tag
        $seoPage->setTitle("Session ".$session_number.", ".$page_title." - ".$page_name." - ".$seoPage->getTitle());
        
        // Get the question for the page
        $questions = $page->getQuestions();
        $question = $questions[0];
        // If the quesiton variable name is set
        if($this->isQuestionPresent($question))
        {
            // Find CourseData Entity
            $CourseData = $em->getRepository('AppBundle\Entity\CourseData')
                ->findOneBy([
                    'course' => $session_manager->getCourseManager()->getCourse(),
                    'var' => $question->getVariable()
                ]);
            // Create CourseData Entity if it doesn't exist
            if(null === $CourseData)
            {
                $CourseData = new CourseData();
                $CourseData->setCourse($session_manager->getCourseManager()->getCourse());
                $CourseData->setVar($question->getVariable());
            }

            // Create the form
            $form = $this->createForm(SessionType::class, $CourseData, [
                'attr' => ['id' => 'session_form'],
                'question' => $question
            ]);

            // Why is this updating the database??
            $form->handleRequest($request);
            
            if ($form->isSubmitted())
            {
                if($form->isValid())
                {
                    $em->persist($CourseData);

                    // Update last_page variable to the next page that should be shown.
                    // This function wil flush too
                    return $session_manager->setNextPage();
                }
                else
                {
                    $em->detach($CourseData);
                    foreach($form->getErrors(true) as $error)
                    {
                        $this->addFlash(
                            'danger',
                            $error->getMessage()
                        );
                    }
                    return $this->redirectToRoute('account_session');
                }
            }
        }
        else
        {
            $form = null;
        }

        $session_manager->recordPageView();
        // Render page with variables
        return $this->render('@App/Account/session.html.twig', [
            'session_number' => $session_number,
            'name' => $page_name,
            'media_type' => $page->getMediaType(),
            'image_path' => $page->getImagePath(),
            'video_url' => $page->getVideoUrl(),
            'text' => $page->getText(),
            'question_type' => null===$question ? null : $question->getInputType(),
            'answers' => null===$question ? null : $question->getAnswerOptions(),
            'title' => $page_title,
            'form' => null===$form ? null : $form->createView(),
            'session_progress_percent' => $session_manager->getSessionProgress()
        ]);
    }
}