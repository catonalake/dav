"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
# todo: cag! figure out how to use this file

import django
from django.test import TestCase

# TODO: Configure your database in settings.py and sync before running tests.

class SimpleTest(TestCase):
    """Tests for the application views."""

    if django.VERSION[:2] >= (1, 7):
        # Django 1.7 requires an explicit setup() when running tests in PTVS
        """
            following was noted after some research as the other tests.py was not working
            reference this for more information: 
            http://stackoverflow.com/questions/29653129/update-to-django-1-8-attributeerror-django-test-testcase-has-no-attribute-cl

        """
        @classmethod
        def setUpTestData(cls):
            return super().setUpTestData()



    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
