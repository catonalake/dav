"""
Definition of urls for votersite.
"""
from django.conf import settings                        # added cag20160118
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static              # added cag20160118
from django.contrib import admin                        # added cag20160118
from django.views.generic.base import RedirectView      # added cag20160226 for favicon.ico 404 error

# Uncomment the next two lines to enable the admin:
from django.contrib import admin

admin.site.site_name = 'Detect A Voter Administration'
admin.site.site_header = 'Detect A Voter Administration'
admin.site.site_title = 'Detect A Voter Admin'
admin.site.index_title = 'Detect A Voter Administration Index Title'
admin.autodiscover()  # cag ? not sure what this does

urlpatterns = [
    # patterns = ('', # removed this on 1/12 cag20160112 as it is being depricated
    #    url(r'^$', include('elections.urls')),  #added this to go to elections urls for now.. cag! todo: create a home page
    # /elections/* will use elections.urls
    url(r'^elections/', include('elections.urls')),

    # /favicon.ico/* will address this weird error
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/img/favicon.ico')),

    # is this actually working??  doesn't seem so cag20160403
    url(r'^/$', RedirectView.as_view(url='/elections/home')),

    # is this actually working??  doesn't seem so cag20160403
    url(r'^$', RedirectView.as_view(url='/elections/home')),

# /home - will this work?  cag!
#    url(r'^yourhome/$', views.yourhome, name='yourhome'),

    # Examples:
    # url(r'^$', 'votersite.views.home', name='home'),
    # url(r'^votersite/', include('votersite.votersite.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin: # todo: cag - find this folder with these urls.. :)
    url(r'^admin/', include(admin.site.urls)),
    #) # cag20160112 removed as prefix is depricated
]
# following added cag20160118
#??  this is not workoing either - trying to get bootstrap working!! cag! todo  # added cag20160118


# django registration redux url
(r'^accounts/', include('registration.backends.default.urls')),


if settings.DEBUG: # add static urls to the patterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


