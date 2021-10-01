from django.db import models

# DOCS todo: joke
#
class TodoItem(models.Model):
    name = models.CharField(max_length=250)
    done = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"[{'x' if self.done else ' '}] {self.name}"
