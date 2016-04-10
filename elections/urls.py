"""
Definition of urls for elections - note this will need to be references in the site votersite/urls.py
"""
# elections/urls.py
from django.conf import settings # added cag20160112
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from . import views
# cag20160130 adding models below for ajax per instructions here: http://lethain.com/two-faced-django-part-5-jquery-ajax/
# removing for now as it is throwing an error
#from models import Fullvstats
#polls = Fullvstats.objects.filter(city='glocester')

urlpatterns = [
    # ex: /elections/home - note changing from /elections/ in project urls removes need for elections
    url(r'^home/$', views.home, name='home'),

    # ex: /elections/city/
    url(r'^city/$', views.vstats, name='city'),

    # ex: /elections/housedistricts/
    url(r'^housedistricts/$', views.vstats, name='housedistricts'),

    # ex: /elections/senatedistricts/
    url(r'^senatedistricts/$', views.vstats, name='senatedistricts'),

    # referenced in getdata ajax call in jstestdt-mar-26
    url(r'^homesonstreet/$', views.homesonstreet, name='homesonstreet'),

    # referenced in vstats ajax call
    url(r'^homesindistrictwithnames/$', views.homesindistrictwithnames, name='homesindistrictwithnames'),

    # ex: /elections/registration_register - from navbar with redux
    url(r'^registration_register/$', views.registration_register, name='registration_register'),

    # ex: /elections/auth_logout - from navbar with redux
    url(r'^auth_logout/$', views.auth_logout, name='auth_logout'),

    # ex: /elections/sign_up - from navbar with redux
    url(r'^sign_up/$', views.sign_up, name='sign_up'),

    # referenced in post ajax call in jstestdt-mar-26 for votertags
    url(r'^tag_voter/$', views.tag_voter, name='tag_voter'),

    # ex: /elections/pendingnotes/
    url(r'^pendingnotes/$', views.reviewvoternotes, name='pendingnotes'),

    # ex: /elections/approvednotes/
    url(r'^approvednotes/$', views.reviewvoternotes, name='approvednotes'),

    # ex: /elections/followupnotes/
    url(r'^followupnotes/$', views.reviewvoternotes, name='followupnotes'),

    # ex: /elections/campaign_dashboard/
    url(r'^campaign_dashboard/$', views.campaign_dashboard, name='campaign_dashboard'),











    # ex: /elections/walkinglist/alphanumericchars \w should be the same as [a-z etc...]
    # going to try using jquery datatables to perform certain functions
    #url(r'^(?P<campaign_type>[a-zA-Z]+)/$', views.walkinglist, name='walkinglist'),


    # ex: /elections/
    url(r'^$', views.index, name='index'), # cag! todo: what is the diff between the views.index and name='index' ?

    # ex: /elections/5/
    url(r'^(?P<voter_id>[0-9]+)/$', views.detail, name='detail'),

    # ex: /elections/detailjson/
    url(r'^detailjson/$', views.detailjson, name='detailjson'),





    # ex: /elections/vajax/ - to get a list of voters at a specific address
    url(r'^vajax/$', views.vajax, name='vajax'), #

    # ex: /elections/vajax/ - to get a list of voters at a specific address
    url(r'^votersataddress/$', views.votersataddress, name='votersataddress'), #

    # referenced in vstats ajax call
    url(r'^homesindistrict/$', views.homesindistrict, name='homesindistrict'),

    # referenced in vstats ajax call
    url(r'^homesincity/$', views.homesincity, name='homesincity'),

    url(r'^contact/$', views.contact, name='contact'),

    # ex: /elections/districtthenvoters/
    # cag20160315 cagtodo - this gets the house districts - prob be good to rename this
    url(r'^districtthenvoters/$', views.districtthenvoters, name='districtthenvoters'),

    # ex: /elections/senatedistrictthenvoters/
    # any way to DRY This up with specific parms to the view insteadof different views and URLs?
    url(r'^senatedistrictthenvoters/$', views.senatedistrictthenvoters, name='senatedistrictthenvoters'),

    # ex: /elections/mhome/
    url(r'^mhome/$', views.mhome, name='mhome'),

    # ex: /elections/districtthenvoters/
    # cag20160315 cagtodo - this gets the house districts - prob be good to rename this
    url(r'^mobiledistrictthenvoters/$', views.mobiledistrictthenvoters, name='mobiledistrictthenvoters'),

    # ex: /elections/vhistfun/
    url(r'^vhistfun/$', views.vhistfun, name='vhistfun'),

    # ex: /elections/votersitehome -
    url(r'^votersitehome/$', views.votersitehome, name='votersitehome'),

    # ex: /elections/home2 - note i changed from /elections/ in project urls so no need for elections now
    url(r'^home2/$', views.home2, name='home2'),

    # ex: /elections/voterlist
    url(r'^voterlist/$', views.votertable, name='voterlist'),

    # ex: /elections/specificpartylist/r/
    url(r'^specificpartylist/(?P<party>[A-Za-z])/$', views.specificpartylist, name='specificpartylist'),

    # ex: /elections/excludepartylist/d/
    url(r'^excludepartylist/(?P<party>[A-Za-z])/$', views.excludepartylist, name='excludepartylist'),

    # ex: /elections/selectedstreet/ - to get a list of voter addresses on a specific street
    url(r'^selectedstreet/$', views.selectedstreet, name='selectedstreet'),
    # note - accidentally calling  views.homesonstreet  returns / displays data and
    # the messy query set is displayed on the page but is kind of cool to see

    # ex: /elections/mapvoters/ - to get a list of voters at a specific address
    url(r'^mapvoters/$', views.mapvoters, name='mapvoters'),
    url(r'^mapvoters2/$', views.mapvoters2, name='mapvoters2'),

    url(r'^mapcityvoters/$', views.mapcityvoters, name='mapcityvoters'),
    url(r'^selectedcity/$', views.selectedcity, name='selectedcity'),

    # ex: /elections/districtwithnames/ - to get a list of voter addresses on a specific street
    url(r'^districtwithnames/$', views.districtwithnames, name='districtwithnames'),

    # ex: /elections/mvnames/ - mobile version of districtwithnames to get a list of voter addresses on a specific street
    url(r'^mvnames/$', views.mvnames, name='mvnames'),

    # ex: /elections/5/results/
    # url(r'^(?P<voter_id>[0-9]+)/results/$', views.results, name='results'),


    # django registration redux url
    url(r'^accounts/', include('registration.backends.default.urls')),

    # commenting out below - not sure what other views we will create
    # ex: /elections/5/vote/
    # url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),

]
#] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # don't do this in prod!  remove for production

# the above is inefficient and should never be active in production
# long term the below should not be done either todo: cag! what should this be prior to deployment??
if settings.DEBUG: # add static urls to the patterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
