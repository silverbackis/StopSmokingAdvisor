<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Form\SessionType;
use AppBundle\Entity\Question;
use AppBundle\Entity\CourseData;

class SharedController extends Controller
{
    protected function isQuestionPresent(Question $question = null)
    {
        return null !== $question && null !== $question->getVariable() && "" !== $question->getVariable();
    }

	protected function sessionPageAction(Request $request)
	{
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