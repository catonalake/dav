from django.contrib import admin
from .forms import CampaignAssignmentForm, CampaignTeamMemberForm, SignUpForm
from .models import SignUp, CampaignTeamMember, CampaignAssignment, Fulldav, Fullvstats

#cag20160323 adding for campaignassingnments
class CampaignAssignmentAdmin(admin.ModelAdmin):
    list_display = ('campaign_username', 'campaign_type', 'campaign_type_value', 'status', 'campaign_email') 
    form = CampaignAssignmentForm
    search_fields = ['campaign_username', 'campaign_type', 'campaign_type_value', 'status', 'campaign_email']

class CampaignTeamMemberAdmin(admin.ModelAdmin):
    list_display = ('campaign_username', 'team_member_username', 'team_member_first_name', 'team_member_last_name', 'status') 
    form = CampaignTeamMemberForm
    search_fields = ['campaign_username', 'team_member_username', 'team_member_first_name', 'team_member_last_name', 'status']

# jan 8 - created this class for using the form
class SignUpAdmin(admin.ModelAdmin):
    list_display = ('emailaddr', 'status')
    form = SignUpForm

# register models for the admin site:
admin.site.register(SignUp, SignUpAdmin)
admin.site.register(CampaignAssignment, CampaignAssignmentAdmin)
admin.site.register(CampaignTeamMember, CampaignTeamMemberAdmin)
# todo: cag! reference C:\Users\cathleen\pythonfolder\mysite\polls\admin.py for example of how this works!!