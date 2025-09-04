# contests/management/commands/finalize_contests.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from contests.models import Contest
from problems.models import Problem

class Command(BaseCommand):
    help = 'Finds contests that have ended and moves their problems to the general problem set.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Checking for ended contests...')
        
        # Find contests that have ended and still have problems linked to them
        ended_contests = Contest.objects.filter(end_time__lt=timezone.now(), problems__isnull=False).distinct()
        
        if not ended_contests:
            self.stdout.write(self.style.SUCCESS('No ended contests with problems to finalize.'))
            return
            
        finalized_count = 0
        for contest in ended_contests:
            # Find all problems associated with this contest
            problems_to_move = Problem.objects.filter(contest=contest)
            
            if problems_to_move.exists():
                count = problems_to_move.count()
                # Set the 'contest' field to null for all these problems at once
                problems_to_move.update(contest=None)
                finalized_count += count
                self.stdout.write(f'Moved {count} problem(s) from contest "{contest.title}" to the general problem set.')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully finalized {finalized_count} problem(s) in total.'))