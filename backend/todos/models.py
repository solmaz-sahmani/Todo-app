from django.db import models

class Todo(models.Model):
    STATUS_CHOICES = [
        ("incomplete", "Incomplete"),
        ("complete", "Complete"),
    ]
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="incomplete")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title