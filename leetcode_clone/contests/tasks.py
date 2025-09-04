from celery import shared_task
from django.utils import timezone
from .models import Contest
from problems.models import Problem

@shared_task
def finalize_ended_contests():
    print("Running scheduled task: Finalizing ended contests...")
    
    ended_contests = Contest.objects.filter(end_time__lt=timezone.now(), problems__isnull=False).distinct()
    
    if not ended_contests:
        print("No ended contests with problems to finalize.")
        return "No ended contests to finalize."
        
    finalized_count = 0
    for contest in ended_contests:
        problems_to_move = Problem.objects.filter(contest=contest)
        if problems_to_move.exists():
            count = problems_to_move.count()
            problems_to_move.update(contest=None)
            finalized_count += count
            print(f'Moved {count} problem(s) from contest "{contest.title}" to the general problem set.')
    
    result_message = f'Successfully finalized {finalized_count} problem(s) in total.'
    print(result_message)
    return result_message