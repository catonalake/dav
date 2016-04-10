# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals

from django.db import models
from django.db.models import Q


# cag20160401 this is address level information
# e.g. has street number and unit level info where vs has only street level
class Fullvstats(models.Model):
    vstat_id = models.AutoField(primary_key=True)
    street_number = models.CharField(max_length=50, blank=True, null=True)
    street_name = models.CharField(max_length=50, blank=True, null=True)
    street_name_2 = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    postal_city = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    zip_code_4 = models.CharField(max_length=20, blank=True, null=True)
    precinct = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    rvoters = models.IntegerField(blank=True, null=True)
    uvoters = models.IntegerField(blank=True, null=True)
    mvoters = models.IntegerField(blank=True, null=True)
    dvoters = models.IntegerField(blank=True, null=True)
    total_voters = models.IntegerField(blank=True, null=True)
    poll_pro = models.IntegerField(blank=True, null=True)
    families_resident = models.IntegerField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)
    state_rep_district = models.CharField(max_length=20, blank=True, null=True)
    state_senate_district = models.CharField(max_length=20, blank=True, null=True)
    congressional_district = models.CharField(max_length=20, blank=True, null=True)
    ward_council = models.CharField(max_length=20, blank=True, null=True)
    ward_district = models.CharField(max_length=20, blank=True, null=True)
    school_committee_district = models.CharField(max_length=20, blank=True, null=True)
    special_district = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fullvstats'

        # cag20160130 - probably don't need this??
    def as_dict(self):
        return {'str_nm':self.street_name, 
                'vstat_id':self.vstat_id, 
                'str_nmbr':self.street_number, 
                'cty':self.city, 
                'dvoters':self.dvoters,
                'rvoters':self.rvoters,
                'uvoters':self.uvoters,
                'mvoters':self.mvoters
                }

    def __str__(self):
        return '%s %s %s %s %s %s %s ' % (self.vstat_id, self.street_number, self.street_name, self.city, self.state_rep_district, self.state_senate_district, self.precinct)

# cag20160401 this is voter level information
class Fulldav(models.Model):
    voter_id = models.CharField(primary_key=True, max_length=25)
    city = models.CharField(max_length=50, blank=True, null=True)
    postal_city = models.CharField(max_length=50, blank=True, null=True)
    street_name = models.CharField(max_length=50, blank=True, null=True)
    street_number = models.IntegerField(blank=True, null=True)
    street_name_2 = models.CharField(max_length=50, blank=True, null=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    precinct = models.CharField(max_length=50, blank=True, null=True)
    status_code = models.CharField(max_length=50, blank=True, null=True)
    state_senate_district = models.CharField(max_length=50, blank=True, null=True)
    state_rep_district = models.CharField(max_length=50, blank=True, null=True)
    congressional_district = models.CharField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    sex = models.CharField(max_length=50, blank=True, null=True)
    current_party = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    vstat_id = models.IntegerField()
    age = models.IntegerField(blank=True, null=True)
    swg2014 = models.IntegerField(blank=True, null=True)
    swp2014 = models.IntegerField(blank=True, null=True)
    pe2012 = models.IntegerField(blank=True, null=True)
    swp2012 = models.IntegerField(blank=True, null=True)
    pp2012 = models.IntegerField(blank=True, null=True)
    swg2010 = models.IntegerField(blank=True, null=True)
    swp2010 = models.IntegerField(blank=True, null=True)
    pe2008 = models.IntegerField(blank=True, null=True)
    staunch_republican = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fulldav'

    def __str__(self):
        return '%s %s %s %s %s %s %s %s %s %s %s ' %  (self.voter_id, self.vstat_id, self.age, self.first_name, self.current_party, self.street_number, self.street_name, self.city, self.state_rep_district, self.state_senate_district, self.precinct)

# cag20160401 this is street level information
class Fullvs(models.Model):
    vstat_id = models.AutoField(primary_key=True)
    street_name = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    postal_city = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    zip_code_4 = models.CharField(max_length=20, blank=True, null=True)
    precinct = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    state_rep_district = models.CharField(max_length=50, blank=True, null=True)
    state_senate_district = models.CharField(max_length=50, blank=True, null=True)
    congressional_district = models.CharField(max_length=50, blank=True, null=True)
    ward_council = models.CharField(max_length=50, blank=True, null=True)
    ward_district = models.CharField(max_length=50, blank=True, null=True)
    school_committee_district = models.CharField(max_length=50, blank=True, null=True)
    special_district = models.CharField(max_length=50, blank=True, null=True)
    rvoters = models.IntegerField(blank=True, null=True)
    uvoters = models.IntegerField(blank=True, null=True)
    mvoters = models.IntegerField(blank=True, null=True)
    dvoters = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fullvs'

    #def __str__(self):
    #    return '%s %s %s %s %s ' % (self.street_name, self.city, self.state_rep_district, self.state_senate_district, self.precinct)
    def __str__(self):
        return ' '.join([
                self.street_name, 
                self.city, 
                self.state_rep_district, 
                self.state_senate_district, 
                self.precinct,
                self.rvoters,
                self.uvoters,
                self.mvoters,
                self.dvoters,
            ])

# cag20160409 this is the voter notes table - to replace vtags for notes..
class VoterNotes(models.Model):
    FOLLOW_UP = 'F'
    NO_FURTHER_ACTION = 'N'
    PENDING = 'P'
    ACCEPTED = 'A'
    REJECTED = 'R'
    NOTES_STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accept'),
        (REJECTED, 'Reject')
    ) # end choices
    NOTES_ACTION_CHOICES = (
        (FOLLOW_UP, 'Follow up'),
        (NO_FURTHER_ACTION, 'No action needed'),
    ) # end choices

    vn_id = models.AutoField(primary_key=True)
    voter_id = models.CharField(max_length=25)
    # cag20160410 to get voter information about a note...
    #voter_id = models.ManyToManyField('Fulldav', related_name="avoter_id")

    campaign_username = models.CharField(max_length=30)
    team_member_username = models.CharField(max_length=30)
    campaign_action = models.CharField(max_length=2, 
                                        choices=NOTES_ACTION_CHOICES,
                                        default=NO_FURTHER_ACTION)
    notes_desc = models.CharField(max_length=254, blank=True, null=True)
    notes_status = models.CharField(max_length=2,
                                choices=NOTES_STATUS_CHOICES,
                                default=PENDING)
    date_added = models.DateTimeField(blank=True, null=True)
    date_updated = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vn'


# cag20160401 this is the voter to tag table - e.g. mail ballot, lawn sign, etc..
class VoterTags(models.Model):
    FOLLOW_UP = 'F'
    ACCEPTED = 'A'
    DECLINED = 'D'
    REVIEW = 'R'
    NA = 'N'
    VOTER_INTERACTION_CHOICES = (
        (FOLLOW_UP, 'Follow Up'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
        (NA, 'Not Applicable')
    ) # end choices
    TRUE = 1
    FALSE = 0
    FOLLOW_UP_CHOICES = (
        (TRUE, 'Follow Up'),
        (FALSE, 'No followup')
    ) # end choices
    TAG_STATUS_CHOICES = (
        (REVIEW, 'Review'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined')
    ) # end choices

    vtag_id = models.AutoField(primary_key=True)
    campaign_username = models.CharField(max_length=30)
    voter_id = models.IntegerField()
    vstat_id = models.IntegerField(blank=True, null=True)
    ct_id = models.IntegerField(default=1)
    email = models.CharField(max_length=75, blank=True, null=True)
    cell_phone = models.CharField(max_length=15, blank=True, null=True)
    other_phone = models.CharField(max_length=15, blank=True, null=True)
    mailing_list = models.IntegerField(blank=True, null=True,
                                    choices=FOLLOW_UP_CHOICES,
                                    default=FALSE)
    lawn_sign = models.CharField(max_length=2, blank=True, null=True,
                                    choices=VOTER_INTERACTION_CHOICES,
                                    default=NA)
    mail_ballot = models.CharField(max_length=2, blank=True, null=True,
                                    choices=VOTER_INTERACTION_CHOICES,
                                    default=NA)
    donation = models.CharField(max_length=2, blank=True, null=True,
                                    choices=VOTER_INTERACTION_CHOICES,
                                    default=NA)
    follow_up = models.IntegerField(blank=True, null=True,
                                    choices=FOLLOW_UP_CHOICES,
                                    default=FALSE)
    notes_desc = models.CharField(max_length=254, blank=True, null=True)
    status = models.CharField(max_length=2,
                                    choices=TAG_STATUS_CHOICES,
                                    default=REVIEW)
    donotcall = models.IntegerField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)
    date_added = models.DateTimeField()
    date_updated = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vt'

# cag20160401 this is a sign up table - folks that want access will sign up here..
class SignUp(models.Model):
    NEW = 'N'
    VERIFIED = 'V'
    DELETED = 'D'
    STATUS_CHOICES = (
        (NEW, 'New'),
        (VERIFIED, 'Verfied'), 
        (DELETED, 'Deleted'),
    ) # end status_choices
    emailaddr = models.EmailField(primary_key=True, max_length=100)
    status = models.CharField(max_length=20, 
                              choices=STATUS_CHOICES,
                              default=NEW)
    first_name = models.CharField(max_length=45, blank=False, null=True)
    last_name = models.CharField(max_length=45, blank=False, null=True)

    # below is not working so commenting it out
    """
    def _get_full_name(self):
        return '%s %s' % (self.first_name, self.last_name)
    full_name = property(_get_full_name)
    """

    class Meta:
        managed = False
        verbose_name = 'Sign Up'
        verbose_name_plural = 'Sign Ups'
        db_table = 'sudb'

#    def __str__(self):
#        return  self.emailaddr
#        return  '%s %s %s %s' % ( self.emailaddr, self.first_name, self.last_name,self.status)
#another way of doing the above __str__ using join: 
    def __str__(self):
        return ' '.join([
            self.emailaddr,
            self.first_name,
            self.last_name,
            ])

# cag20160401 this is a username to district / campaign assignment table
class CampaignAssignment(models.Model):
    SENATE = "SENATEDISTRICTS"
    HOUSE = "HOUSEDISTRICTS"
    CONGRESS = "CONGRESS"
    CITY = "CITY"
    STATE = "RI"
    TBD = "tbd"
    CAMPAIGN_TYPE_CHOICES = (
        (HOUSE, 'House'), 
        (SENATE, 'Senate'),
        (CITY, 'City'),
        (CONGRESS, 'Congress'),
        (STATE, 'Statewide'),
        (TBD, 'Not Sure'),
    ) # end campaign_type_choices
    ACTIVE = "A"
    INACTIVE = "I"
    DELETED = "D"
    PENDING = "P"
    STATUS_CHOICES = (
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
        (DELETED, 'Deleted'), 
        (PENDING, 'Pending'), 
    ) # end status_choices
    campaign_assignment_id = models.AutoField(primary_key=True)
    campaign_username = models.CharField(max_length=30)
    campaign_type = models.CharField(max_length=45,
                                     choices=CAMPAIGN_TYPE_CHOICES,
                                     default=TBD)
    campaign_type_value = models.CharField(max_length=100)
    status = models.CharField(max_length=2,
                              choices=STATUS_CHOICES,
                              default=PENDING)
    campaign_email = models.CharField(max_length=254, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'campaign_assignment'

    def __str__(self):
        return ' '.join([
            self.campaign_username,
            self.campaign_type,
            self.campaign_type_value,
            self.status,
            self.campaign_email,
            ])

class CampaignTeamMember(models.Model):
    ACTIVE = "A"
    INACTIVE = "I"
    DELETED = "D"
    PENDING = "P"
    STATUS_CHOICES = (
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
        (DELETED, 'Deleted'), 
        (PENDING, 'Pending'), 
    ) # end status_choices
    ct_id = models.AutoField(primary_key=True)
    campaign_username = models.CharField(max_length=30)
    team_member_username = models.CharField(unique=True, max_length=30)
    status = models.CharField(max_length=2,
                              choices=STATUS_CHOICES,
                              default=PENDING)
    campaign_email = models.CharField(max_length=254, blank=True, null=True)
    cell_phone = models.CharField(max_length=15, blank=True, null=True)
    other_phone = models.CharField(max_length=15, blank=True, null=True)
    notes_desc = models.CharField(max_length=254, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True)
    date_updated = models.DateTimeField(blank=True, null=True)
    team_member_first_name = models.CharField(max_length=45)
    team_member_last_name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'ct'


    def __str__(self):
        return ' '.join([
            self.campaign_username,
            self.team_member_username,
            self.status,
            self.team_member_first_name,
            self.team_member_last_name,
            ])


# todo: cag! see about using model managers this - and study this http://stackoverflow.com/questions/19705910/using-generic-listview-with-pagination-django

# should this be its own class or part of the voter class ?  ConservativeList(models.Manager):
            
# cag! todo find a way to use generator - see http://stackoverflow.com/questions/231767/what-does-the-yield-keyword-do-in-python
# cag! todo - here is a tutorial: http://www.oracle.com/webfolder/technetwork/tutorials/obe/db/oow10/python_django/python_django.htm


# todo: cag! - good place for reference and examples: http://www.effectivedjango.com/
# todo: cag! - good reference for models: https://docs.djangoproject.com/en/1.8/ref/models/fields/#model-field-types
