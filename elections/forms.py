from django import forms
from .models import SignUp
from .models import CampaignAssignment, VoterTags, VoterNotes, CampaignTeamMember
# cag201604 try to use this 
from django.forms.widgets import Select
from django.contrib.auth.models import User

#import pytz
# cag20160407 todo  review  above imported for time zone logic -
#   -  https://docs.djangoproject.com/en/1.9/topics/i18n/timezones/
from django.utils import timezone
#from django.conf import settings
from django.template import RequestContext
from django.forms.widgets import RadioSelect

# todo: contact form is next cag!
class ContactForm(forms.Form):
    full_name = forms.CharField()
    email = forms.EmailField()
    message = forms.CharField()


# describe VoterNotesForm
# TODO: review this http://www.effectivedjango.com/forms.html
# and this one for querysets in forms: http://stackoverflow.com/questions/13518644/django-model-from-as-radio-select
# another good reference to get rid of empty labels: http://stackoverflow.com/questions/13518644/django-model-from-as-radio-select
class VoterNotesForm(forms.ModelForm):  
    class Meta:
        model = VoterNotes
        fields = [  'voter_id',                 # required
                    'campaign_username',        # required
                    'team_member_username',     # required
                    'campaign_action',
                    'notes_desc',
                    'notes_status',             # required
                    'date_added'
                    ] 
        widgets = {
            'notes_desc': forms.Textarea(
                attrs={'rows':3, 'cols':30,'id': 'post-notes-desc', 'required': True, 'placeholder': 'Enter voter notes', 'title': 'Enter notes for selected voter'}
                ),
            'campaign_action': forms.Select(
                attrs={'id': 'post-campaign-action', 'required': False, 'title': 'Select for followup'}
                ),
            'team_member_username': forms.HiddenInput( # changed from HiddenInput
                attrs={'id': 'post-team-member-username', 'readonly': True}
                ),
            'campaign_username': forms.HiddenInput(
                attrs={'id': 'post-campaign-username', 'readonly': True}
                ),
            'voter_id': forms.HiddenInput(
                attrs={'id': 'post-voter-id', 'readonly': True}
                ),
            'notes_status': forms.HiddenInput(
                attrs={'id': 'post-notes-status', 'readonly': True}
                ),
            'date_added': forms.HiddenInput(
                attrs={'id': 'post-date-added', 'readonly': True}
                ),
        } 
    
    def clean_notes_status(self):
        notes_status = self.cleaned_data.get('notes_status')
        # check if this user is actually the manager 
        #   is done in the view and bound to the form 
        return notes_status

    def clean_date_added(self):
        date_added = self.cleaned_data.get('date_added')
        # note this generates a naive date runtime error.. but works for now 
        import time
        date_added = time.strftime('%Y-%m-%d %H:%M:%S')
        print('in voternotesform clean_date_added after i changed it = ', date_added)
        return date_added

    
# describe SignUpForm
class SignUpForm(forms.ModelForm):  
    class Meta:
        model = SignUp
        fields = ['emailaddr', 'first_name', 'last_name'] # what is the diff between this and the signupadmin list fields?  neither is working
#        fields = ['full_name'] # todo: cag! this is not working!!
    
    # this overrides the default clean function ?
    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        return last_name

    def clean_emailaddr(self):
        emailaddr = self.cleaned_data.get('emailaddr')
        email_base, provider = emailaddr.split('@')
        domain, extension = provider.split('.')
        return emailaddr

        

# describe CampaignAssignment form
class CampaignAssignmentForm(forms.ModelForm):  
    class Meta:
        model = CampaignAssignment
        fields = ['campaign_username', 'campaign_type', 'campaign_type_value', 'campaign_email', 'status']

# describe CampaignTeamMember form
class CampaignTeamMemberForm(forms.ModelForm):  
    class Meta:
        # cag20160409 testing selection on forms.
        CHOICES = CampaignAssignment.objects.all()
        USERS = User.objects.all()

        model = CampaignTeamMember
        fields = ['team_member_username', 'team_member_first_name', 'team_member_last_name', 'campaign_username', 'status']
        # cag20160409 testing selection on forms.
        widgets = {
            'team_member_username': Select(choices=( (x.username, x.username) for x in USERS) ),
            'campaign_username': Select(choices=( (x.campaign_username, x.campaign_username) for x in CHOICES) ),
        }

