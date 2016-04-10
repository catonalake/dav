# Create your views here.
from django.shortcuts import get_object_or_404, get_list_or_404, render
from django.http import HttpResponse # cag20160130 research if HttpResponseRedirect has been depricated?
from django.template import RequestContext, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q 
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt, csrf_protect
from django.core import serializers
import json
import operator
from django.http import JsonResponse
from .models import Fullvs, Fullvstats, CampaignAssignment, Fulldav, VoterTags
from .forms import ContactForm, SignUpForm, VoterTagsForm
from functools import reduce
from django.core.urlresolvers import resolve # added to tell what url the view was called from
from django.core.mail import send_mail
from django.conf import settings


# clean the below up
def home(request): 
    city_campaign = "city"
    rep_campaign = "house"
    senate_campaign = "senate"
    home = "Welcome " 
    if request.user.is_authenticated():
        sitevisitor = (request.user.username).title() # capitalize the first letter of the username
        #print (sitevisitor)
        home = "Welcome to Detect A Voter Home Site %s!" % (sitevisitor)  
        #print (home)
    else:
        sitevisitor = "Guest"
        home = home + " Please provide your contact information below for information about our products and and services!" 

    if (request.method == "POST"): 
        print (request.POST)
        form = SignUpForm(request.POST or None) # need or None or else shows up 
        if form.is_valid():
            # how about putting these in a single function?
            form_first_name = form.clean_first_name()
            form_emailaddr = form.clean_emailaddr()
            form_last_name = form.clean_last_name()
            instance = form.save(commit=False)
            instance.save()
            #print (instance.emailaddr)
            #print (instance.first_name)
            home ="Thank You for registering %s" % (instance.emailaddr)
            subject = "Site Contact Form"
            from_email = settings.EMAIL_HOST_USER
            print (from_email)
            to_email = [form_emailaddr, from_email, 'cathleen2@gmail.com']
            contact_message = """
            %s: %s via %s
            """% (form_first_name, form_emailaddr)

            #send_mail(subject, 
            #    contact_message, 
            #    from_email, 
            #    [to_email], 
            #    fail_silently=False)
    else:
        form = SignUpForm() # need or None or else shows up 

    context = {'home': home,
                'form': form,
                'sitevisitor': sitevisitor,
                'city_campaign': city_campaign,
                'rep_campaign': rep_campaign,
                'senate_campaign': senate_campaign
                }
    return render(request, 'elections/home.html', context) 


# on navbar 
#  - when clicking City - url is city
#  - when clicking House - url is housedistricts
#  - when clicking Senate - url is senatedistricts
# cag20160323 complete
@ensure_csrf_cookie
def vstats(request):
    #print ('in vstats view')
    resolver_match = resolve(request.path)
    url_path =    resolver_match.url_name
    print('url path = ' + resolver_match.url_name)
    camp_array = []
    query_information = "City and street level voter totals"

    # this view can be called from several urls...
    # think about changing to a dictionary so we don't need all these if stmts.. :)
    if url_path == 'city':
        request_controller   = url_path
        list_description = "Cities/ Towns include "
    elif url_path == 'housedistricts':
        request_controller = url_path
        list_description = "State Rep Districts include "
    elif url_path == 'senatedistricts':
        request_controller = url_path
        list_description = "Senate Districts include "
    else:
        return HttpResponse("Error with url path  :)")

    active_campaign_status = "A"

    if request.user.is_authenticated():
        sitevisitor = request.user.username.title()
        try:
            campaign = get_list_or_404(CampaignAssignment.objects.\
            filter(campaign_username=sitevisitor).\
            filter(status=active_campaign_status).\
            filter(campaign_type=request_controller))
        except:
            return HttpResponse("You must have an active campaign set up to access this  :)")

        # get the campaign information for this person
    else:
        return HttpResponse("You must be logged in to see this content  :)")
        # if they are not authenticated, remind them to log in..  
        # put something here telling them no can do...

    ctr = 0
    #print('campaigns set up for ' + sitevisitor +" = ")
    for c in campaign:
        ctr +=1
        camp_array.append(c.campaign_type_value.title())
        #print (c.campaign_type_value)

    town_list = tuple(camp_array)


    if request_controller == 'city':
        try:
            vstats_table = Fullvs.objects.filter(reduce(operator.or_, (Q(city=param1) for param1 in camp_array)))
        except:
            return HttpResponse("Error retrieving homes in city/ town campaign  :)")
    elif request_controller == 'housedistricts':
        try:
            vstats_table = Fullvs.objects.filter(reduce(operator.or_, (Q(state_rep_district=param1) for param1 in camp_array)))
        except:
            return HttpResponse("Error retrieving homes in house district campaign  :)")
    elif request_controller == 'senatedistricts':
        try:
            vstats_table = Fullvs.objects.filter(reduce(operator.or_, (Q(state_senate_district=param1) for param1 in camp_array)))
        except:
            return HttpResponse("Error retrieving homes in senate district campaign  :)")
    else:
        return HttpResponse("Error processing request  :)")

    data = {'campaign_username': request.user.username,
            'ct_id': 999999999,
    }
    form = VoterTagsForm(data) # bound to the campaign_username

    # cag20160404 - todo: check out field.disabled 
    #    - https://docs.djangoproject.com/en/1.9/ref/forms/fields/
        
    #for v in vstats_table:
    #    print (v.vstat_id)

    context = {'vstats_table': vstats_table,
               'sitevisitor': sitevisitor,
               'town_list': town_list,
               'query_information ': query_information,
               'request_controller': request_controller,
               'list_description': list_description,
               'form': form,
               }
    return render(request, 'elections/electablevstatsdatatable2.html', context)
# end vstats view

# to see a list of house numbers on the map for a specific street for the specific campaign
# this is strictly used for ajax call needed to mark the addresses on the map
# function calling this is getdata in jstestdt2-mar-21.js
@ensure_csrf_cookie
def homesonstreet(request):
    #print('in homesonstreet')

    resolver_match = resolve(request.path)
    url_path =    resolver_match.url_name
    #print('url path = ' + resolver_match.url_name)
    camp_array = []
    query_information = "City and street level voter totals"

    city = request.GET.get('city', '')
    street_name = request.GET.get('street_name', '')
    precinct = request.GET.get('precinct', '')
    state_rep_district = request.GET.get('state_rep_district', '')
    state_senate_district = request.GET.get('state_senate_district', '')
    congressional_district = request.GET.get('congressional_district', '')
    request_controller = request.GET.get('request_controller', '')

    #print('in homesonstreet view and printing this for debugging.....  :)')
    #print('city ' + city)
    #print('street name is ' + street_name)
    #print('precinct name is ' + precinct)
    #print('state_rep_district ' + state_rep_district)
    #print('state_senate_district ' + state_senate_district)
    #print('congressional_district ' + congressional_district)
    #print('request_controller ' + request_controller)

    # this view can be called from several urls...
    if request_controller == 'city':
        list_description = "Cities/ Towns include "
        #print('request_controller is city ')
    elif request_controller == 'housedistricts':
        list_description = "State Rep Districts include "
        #print('request_controller is housedistricts ')
    elif request_controller == 'senatedistricts':
        list_description = "Senate Districts include "
        #print('request_controller is senatedistricts ')
    else:
        #print('error homesonstreet with request_controller ' + request_controller)
        return HttpResponse("Error with request_controller value " + request_controller)


    #  "GET" the above fields from the data passed in the ajax call in the getdata function
    # make sure we gether the data from vs which has the stats.. 

    if request_controller == 'city':
        try:
            homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(city=city)))
        except:
            return HttpResponse("Error retrieving voters on selected street in city/ town " + city)
    elif request_controller == 'housedistricts':
        try:
            homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(state_rep_district=state_rep_district)))
        except:
            return HttpResponse("Error retrieving voters on selected street in house district " + state_rep_district)
    elif request_controller == 'senatedistricts':
        try:
            homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(state_senate_district=state_senate_district)))
        except:
            return HttpResponse("Error retrieving voters on selected street in senate district " + state_senate_district)
    else:
        return HttpResponse("Error processing request  :)")

    # what is the below code doing????
    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['message'] = list(republican_list)
    except:
        response_data['result'] = 'Rats'
        response_data['message'] = 'sub process did not execute properly'

    return JsonResponse(homesjson , content_type="application/json", safe=False)

# to see a list of voters for a specific street for the specific campaign
# this is strictly used for ajax call needed to populate the voters datatable with all voters at each address in the specified street for the specific district
# function calling this is getdata in jstestdt
# changing to see if jquery form works..
# the exempt below didnt work.. :(
# cag20160328 try : http://stackoverflow.com/questions/21741946/does-csrf-exempt-decorator-make-django-view-unsafe
#  - also see exempt django docs: https://docs.djangoproject.com/en/dev/ref/csrf/#django.views.decorators.csrf.csrf_exempt
# 
#@csrf_exempt
@ensure_csrf_cookie 
def homesindistrictwithnames(request):
    #print('in homesindistrictwithnames')

    resolver_match = resolve(request.path)
    url_path =    resolver_match.url_name
    #print('url path = ' + resolver_match.url_name)
    camp_array = []
    query_information = "Address level voter information"

    city = request.GET.get('city', '')
    street_name = request.GET.get('street_name', '')
    precinct = request.GET.get('precinct', '')
    state_rep_district = request.GET.get('state_rep_district', '')
    state_senate_district = request.GET.get('state_senate_district', '')
    congressional_district = request.GET.get('congressional_district', '')
    request_controller = request.GET.get('request_controller', '')
    vstat_id = request.GET.get('vstat_id', '')

    #print('printing this for debugging.....  :)')
    #print('city ' + city)
    #print('street name is ' + street_name)
    #print('precinct name is ' + precinct)
    #print('state_rep_district ' + state_rep_district)
    #print('state_senate_district ' + state_senate_district)
    #print('congressional_district ' + congressional_district)
    #print('request_controller ' + request_controller) # this is covered in if statement below... :)

    # this view can be called from several urls...
    # cag20160326 - think about using a dictionary for these..??
    #  - like this..  - request_controller = rc_dict[request_controller]  
    #  - note - just need to know how to handle when it is not in the dict...
    if request_controller == 'city':
        list_description = "Cities/ Towns include "
        #print('request_controller is city ')
    elif request_controller == 'housedistricts':
        list_description = "State Rep Districts include "
        #print('request_controller is housedistricts ')
    elif request_controller == 'senatedistricts':
        list_description = "Senate Districts include "
        #print('request_controller is senatedistricts ')
    else:
        print('error homesonstreet with request_controller ' + request_controller)
        #return HttpResponse("Error with request_controller value " + request_controller) 
        # above return prob wont' work cuz this view is called from an ajax call...

    # cag20160323 todo: change this from fullview to elections or
    #    update fullview table with more data so it isn't so restrictive
    # cag20160326 - created fulldav to manage detectavoter info

    #print(' in homesindistrictwithnames and request_controller = ' + request_controller )
    #print('street_name = '+ street_name)
    #print('city = '+city)
    #print('state_rep_district = '+state_rep_district)
    #print('vstat_id = '+vstat_id)


    # cag20160322 todo: add precincts to this logic at some point :)
    if request_controller == 'city':
        try:
            print('querying city ')
            homesjson = serializers.serialize("json", get_list_or_404(Fulldav.objects.\
                filter(Q(swg2014=True)|Q(swp2014=True)|Q(pe2012=True)).\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(city=city).\
                order_by('street_number', 'unit')))
        except:
            return HttpResponse("Error retrieving voters on selected street in city/ town " + city)
    elif request_controller == 'housedistricts':
        try:
            print('querying house districts')
            homesjson = serializers.serialize("json", get_list_or_404(Fulldav.objects.\
                filter(Q(swg2014=True)|Q(swp2014=True)|Q(pe2012=True)).\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(city=city).\
                filter(state_rep_district=state_rep_district).\
                order_by('street_number', 'unit')))
        except:
            return HttpResponse("Error retrieving voters on selected street in house district " + state_rep_district)
    elif request_controller == 'senatedistricts':
        try:
            print('querying senate districts')
            homesjson = serializers.serialize("json", get_list_or_404(Fulldav.objects.\
                filter(Q(swg2014=True)|Q(swp2014=True)|Q(pe2012=True)).\
                filter(precinct=precinct).\
                filter(street_name=street_name).\
                filter(city=city).\
                filter(state_senate_district=state_senate_district).\
                order_by('street_number', 'unit')))
        except:
            return HttpResponse("Error retrieving voters on selected street in senate district " + state_senate_district)
    else:
        return HttpResponse("Error processing request  :)")
    # cag20160326 note - changed above queries from filtering using vstat_id cuz 
    #       the vs rows can have many roes -  granular - by precinct, rep etc.. so two people on the same street could be in a different city

    return JsonResponse(homesjson, content_type="application/json", safe=False)


# the following is now taken care of with registration redux - yay django!! but we still need these present in Views..
def registration_register(request):
    return HttpResponse("You're at the registration_register page :)")

def auth_logout(request):
    return HttpResponse("You're at the auth_logout page :)")

def sign_up(request): 
    if request.user.is_authenticated():
        sitevisitor = (request.user.username).title() # capitalize the first letter of the username
    else:
        sitevisitor = "Guest"

    home = "Welcome!"
    first_name = ""
    last_name = ""
    emailaddr = ""

    if (request.method == "POST"): 
        print (request.POST)
        form = SignUpForm(request.POST or None) # need or None or else shows up 
        if form.is_valid():
            # how about putting these in a single function?
            first_name = form.clean_first_name()
            emailaddr = form.clean_emailaddr()
            last_name = form.clean_last_name()
            instance = form.save(commit=False)
            instance.save()
            #print (instance.emailaddr)
            #print (instance.first_name)
            home ="Thank You for registering %s" % (instance.emailaddr)
    else:
        form = SignUpForm() # need or None or else shows up 


    context = {'home': home,
                'form': form,
                'first_name': first_name,
                'last_name': last_name,
                'emailaddr': emailaddr,
                'sitevisitor': sitevisitor,
                }

    return render(request, 'elections/home.html', context) 


# testing form in ajax - cag20160329 todo
@csrf_protect
def tag_voter(request): 
    print('in tag_voter')
    successText = 'Success!'
    failedText = 'Hmm.. something went wrong processing request'

    if (request.method == "POST"): 
        print (request.POST)
        # get the values from the data passed  
        notes_desc = request.POST.get('notes_desc', '')
        voter_id= request.POST.get('voter_id', '')
        ct_id =  request.POST.get('ct_id', '')

        # default values not on the form:
        campaign_username = request.user.username
        status = "R"

        # sanity check
        print('notes_desc = ', notes_desc)
        print('voter_id = ', voter_id)
        print('ct_id = ', ct_id)
        print('campaign_username = ', campaign_username)
        print('status = ', status)


        form = VoterTagsForm(request.POST or None) # need or None or else shows up 
        if form.is_valid():
            notes_desc = form.clean_notes_desc()
            date_added = form.clean_date_added() # this is just to set the date...
    
            # elements to set which the user cannot change:
            print('just before setting the time.. campaign_username = ', campaign_username)

            instance = form.save(commit=False)
            instance.save()
    else:
        form = VoterTagsForm() # need or None or else shows up 

    context = {'success': successText,
               'failed': failedText,
               'voter_id': voter_id,
               'campaign_username': campaign_username,
               'notes_desc': notes_desc
    }

    return JsonResponse(context, content_type="application/json", safe=False)





















def votertable(request): # exclude democrats
    voter_table = Fulldav.objects.exclude(party_code='d' ).order_by('city').order_by('street_name').order_by('street_number')[:250]
    voterclass = ""
    context = {'voter_table': voter_table,
               'voterclass': voterclass
               }
    return render(request, 'elections/votertable.html', context)

def home2(request): # base2 for now...  
    # use this view to change the way the form works using info from this link:
    # http://stackoverflow.com/questions/5823580/django-form-resubmitted-upon-refresh
    home2 = 'home2 context variable'
    #if (request.method == "POST"): 
    #    print (request.POST)
    form = SignUpForm(request.POST or None) # need or None or else shows up 
    context = {'home2': home2,
               'form': form,}
    form = SignUpForm(request.POST or None) # need or None or else shows up 
    # todo: get this form working cag20150116 - 
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        #print (instance.emailaddr)
        #print (instance.first_name)
        thankyou="Thank You for registering %s" % (instance.emailaddr)
        context = {'home2': thankyou}
    return render(request, 'elections/home.html', context)

def votersitehome(request):
#    votersitehome = "some text"
    votersitehome = "Welcome ! "
    if request.user.is_authenticated():
        votersitehome = "Welcome %s !! " % (request.user)
    form = SignUpForm(request.POST or None) # need or None or else shows up 
    context = {'votersitehome': votersitehome,
               'form': form,
               } # context 
    form = SignUpForm(request.POST or None) # need or None or else shows up 
    # todo: get this form working cag20150116 - 
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        #print (instance.emailaddr) # note the instance is the form :)
        #print (instance.first_name)
        thankyou="Thank You for registering %s" % (instance.emailaddr)
        context = {'votersitehome': thankyou}
    return render(request, 'elections/votersitehome.html', context)


# called when url is elections and nothing else -  note this doesn't check to see if user is authenticated
def index(request):
# to acccess this go to http://127.0.0.1:8000/elections/ 
# note: 
# i changed the urls.py in votersite to point to index even if elections is not listed... see todo in urls.py about home page 
#    republican_list = Voter.objects.order_by('-last_name')[:5] # cag ? not sure what the :5 is for?
#  thid code described here: https://docs.djangoproject.com/en/1.9/intro/tutorial03/
    '''
    return HttpResponse("You're at the index page :)")
    '''
    index = "List of voters - with django pagination :)"
    republican_list = Fulldav.objects.order_by('last_name')[:250]
    paginator = Paginator(republican_list , 25) # Show 25 contacts per page - may want to change this to READ 25 at a time...
    page = request.GET.get('page')
    try:
        republicans = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        republicans = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        republicans = paginator.page(paginator.num_pages)

    context = {'republicans': republicans,
               'index': index
               }
#    return render(request, 'elections/index.html', context)
    return render(request, 'elections/votergridwithjquery.html', context)

# to see a list of voters for a specific address 
# this is strictly used for ajax calls
# function calling this is needvoters.js
@ensure_csrf_cookie
def votersataddress(request):
#    republican_list = Voter.objects.filter(city=request.POST.get('city', '')).filter(unit=request.POST.get('unit', '')).filter(street_name=request.POST.get('street_name', '')).filter(street_number=request.POST.get('street_number', '')).values_list('first_name', 'last_name')
#    republican_list = Voter.objects.filter(city=request.GET.get('city', '')).filter(street_name=request.GET.get('street_name', '')).filter(street_number=request.GET.get('street_number', '')).values_list('first_name', 'last_name')
#    json_data = json.dumps(republican_list) # need to convert this to json...??
# maybe replace the filter stuff with a raw query?
    city = request.GET.get('city', '')
    street_name = request.GET.get('street_name', '')
    street_number = request.GET.get('street_number', '')
    unit = request.GET.get('unit', '')

    print('in votersataddress view and printing this for debugging.....  :)')
    print('street number is ' + street_number)
    print('street name is ' + street_name)
    print('city ' + city)
    print('unit ' + unit )
 
    votersjson = serializers.serialize("json", get_list_or_404(Fulldav.objects.\
        filter(city=city).\
        filter(street_name=street_name).\
        filter(street_number=street_number).\
        filter(unit=unit)))

    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['message'] = list(republican_list)
    except:
        response_data['result'] = 'Rats'
        response_data['message'] = 'sub process did not execute properly'

    return JsonResponse(votersjson , content_type="application/json", safe=False)

# called when url is elections/#somenumber# where #somenumber#  is the id of a specific voter
def detail(request, voter_id):
    voter = get_object_or_404(Fulldav, pk=voter_id)
    return render(request, 'elections/detail.html', {'voter': voter})


def vhistfun(request):
    election_table = Fullvstats.objects.raw("""SELECT 
	                        vs.vstat_id,
                            vs.city,
                            vs.street_name,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvstats vs
                            where vs.city = 'burrillville' or vs.city = 'glocester'
                        GROUP BY vs.city, vs.street_name;
                """)

# how to have a list of voters?
    party_list=('r','u')
    town_list=('Glocester', 'Burrillville')
    query_information = "City and street voter totals"

    # had to change to below from:    paginator = Paginator(election_table , 25) # Show 25 contacts per page - may want to change this to READ 25 at a time...
    paginator = Paginator(list(election_table), 25) # 25 per page

    page = request.GET.get('page')
    try:
        electpage = paginator.page(page)
    except PageNotAnInteger:        # If page is not an integer, deliver first page.
        electpage = paginator.page(1)
    except EmptyPage:        # If page is out of range (e.g. 9999), deliver last page of results.
        electpage = paginator.page(paginator.num_pages)

    context = {'electpage': electpage,
               'party_list': party_list,
               'town_list': town_list,
               'query_information ': query_information
               }
    return render(request, 'elections/electablevstats.html', context)



# cag20160130 todo - make this list much simpler - and finish using jquery!?!?  
@ensure_csrf_cookie
def vajax(request):
    election_table = Fullvstats.objects.raw("""SELECT 
                    *
                FROM
                    newvoterproject.fullvstats vh1
                WHERE
                    (rvoters > 0 OR uvoters > 0)
                        AND dvoters = 0
                        AND 
                        (city = 'glocester' 
                        OR 
                        city = 'burrillville')
                        
                GROUP BY vh1.city , vh1.street_name , CONVERT( SUBSTRING_INDEX(vh1.street_number, '-', - 1) , UNSIGNED INTEGER) 

                ;
                """)

# how to have a list of voters?
    party_list=('r','u')
    town_list=('Glocester', 'Burrillville')
    query_information = "Voters in the 2012 Presidential Election (election_3) and either the 2008 Presidential Election (election_8)or the 2012 Presidential Primary (election_5)"

    paginator = Paginator(list(election_table), 100)
# had to change this    paginator = Paginator(election_table , 25) # Show 25 contacts per page - may want to change this to READ 25 at a time...
    page = request.GET.get('page')
    try:
        ajaxelectpage = paginator.page(page)
    except PageNotAnInteger:        # If page is not an integer, deliver first page.
        ajaxelectpage = paginator.page(1)
    except EmptyPage:        # If page is out of range (e.g. 9999), deliver last page of results.
        ajaxelectpage = paginator.page(paginator.num_pages)

    context = {'ajaxelectpage': ajaxelectpage,
               'party_list': party_list,
               'town_list': town_list,
               'query_information ': query_information
               }
    return render(request, 'elections/electablevstatsajax.html', context)



# display a list of voeters with a specific party code

def excludepartylist(request, party): # returns a list of voters in all party's except the party specified
    voter_table = Fulldav.objects.exclude(party_code=party ).order_by('city').order_by('street_name').order_by('street_number')[:250]
    context = {'voter_table': voter_table}
    return render(request, 'elections/votertable.html', context)

def specificpartylist(request, party): # returns a list of voters in a specific party 
    voter_table = get_list_or_404(Fulldav, party_code=party)[:250] 
    party_specified = party  # cag! success: set party variable in context so it can be referenced in template
    context = {'voter_table': voter_table,
               'party_specified': party_specified}
    return render(request, 'elections/votertable.html', context)

# todo: cag! review about queries: https://docs.djangoproject.com/en/1.9/topics/db/queries/
# todo: more good stuff about django and python from stackoverflow: http://stackoverflow.com/questions/4048973/whats-the-best-way-to-start-learning-django


# finish this later
def contact(request):
    form = ContactForm(request.POST or None)

    context = {
        "form": form,
    }
    return render(request, "forms.html", context)

def selectedstreet(request):
    paragraph_to_print = 'Thanks for waiting!  Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/selectedstreet.html', context)

def districtwithnames(request):
    paragraph_to_print = 'Thanks for waiting!  Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/districtwithnames.html', context)

# mobile version of districtwithnames
def mvnames(request):
    paragraph_to_print = 'Thanks for waiting!  Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/mvnames.html', context)

def mapvoters(request):
    paragraph_to_print = 'Thanks for waiting!  Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/mapvoters.html', context)


def mapvoters2(request):
    paragraph_to_print = 'Thanks for waiting!  processing array of addresses... Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/mapvoters2.html', context)

def mapcityvoters(request):
    vstats_table = Fullvstats.objects.raw("""SELECT 
                            vs.vstat_id,
                            vs.city,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvstats vs
                            where vs.city = 'glocester' or vs.city = 'burrillville' or vs.city = 'north smithfield'
                        GROUP BY vs.city;
                """)

    town_list=('Glocester', 'Burrillville', 'North Smithfield')

    query_information = "City  level voter totals"

    # removed paging - manage that through jquery and bootstrap to avoid page refreshes

    context = {'vstats_table': vstats_table,
               'town_list': town_list,
               'query_information ': query_information
               }
    return render(request, 'elections/mapcityvoters.html', context)

@ensure_csrf_cookie
def homesincity(request):
    print('in homesincity !')
    city = request.GET.get('city', '')

    print('in homesincity view and printing this for debugging.....  :)')
    print('city ' + city)

    homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
        filter(city=city).\
        filter(Q(rvoters__gt=0)|Q(uvoters__gt=0))))
    # question -should i replace above with a raw query using variables??  if so how ?  and why?
    # how can i get street numbers returned as numeric not string?  right now they are in text order like 1 10 120 2 23 etc..   

    # what is the below code doing????
    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['message'] = list(republican_list)
    except:
        response_data['result'] = 'Rats'
        response_data['message'] = 'sub process did not execute properly'

    return JsonResponse(homesjson , content_type="application/json", safe=False)


def selectedcity(request):
    paragraph_to_print = 'Thanks for waiting!  Fetching data now...  '

    context = {'paragraph_to_print': paragraph_to_print
               }
    return render(request, 'elections/selectedcity.html', context)

@ensure_csrf_cookie
def housedistricts(request):
    raw_sql = """       SELECT 
                            vs.vstat_id,
                            vs.city,
                            vs.postal_city,
                            vs.street_name,
                            vs.state_rep_district,
                            vs.state_senate_district,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvstats vs
                        WHERE
                            vs.state_rep_district IN ('21', '71', '28', '19', '40', '53')
                        GROUP BY 
                            vs.city, 
                            vs.street_name, 
                            vs.state_rep_district;
                """
    vstats_table = Fullvstats.objects.raw(raw_sql)

    house_districts = ('21', '71', '28', '19', '40', '53')

    #town_list=('All towns') - eventually move this
    town_list=('21', '71', '28', '19', '40', '53')

    query_information = "RI House District Statistics"

    request_controller = "housedistricts"

    context = {'vstats_table': vstats_table,
               'town_list': town_list,
               'query_information': query_information,
                'house_districts': house_districts,
                'request_controller': request_controller                
               }
    return render(request, 'elections/districtstats.html', context)
    # return render(request, 'elections/electablevstatsdatatable.html', context)

@ensure_csrf_cookie
def senatedistricts(request):
    raw_sql = """       SELECT 
                            vs.vstat_id,
                            vs.city,
                            vs.postal_city,
                            vs.street_name,
                            vs.state_rep_district,
                            vs.state_senate_district,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvs vs
                        WHERE
                            vs.state_senate_district IN ('19', '28', '21', '23')
                        GROUP BY 
                            vs.city, 
                            vs.street_name, 
                            vs.state_senate_district;
                """
    vstats_table = Fullvstats.objects.raw(raw_sql)

    senate_districts = ('19', '28', '21', '23')

    town_list=('19', '28', '21', '23')

    query_information = "RI Senate District Statistics"

    request_controller = "senatedistricts"

    context = {'vstats_table': vstats_table,
               'town_list': town_list,
               'query_information': query_information,
               'senate_districts': senate_districts,
               'request_controller': request_controller                
               }

    return render(request, 'elections/senatedistrictstats.html', context)
    # return render(request, 'elections/electablevstatsdatatable.html', context)
    # return render(request, 'elections/districtstats.html', context)
    # cag20160310 cag think about making this more generic and reusing the districtstats  html file..

@ensure_csrf_cookie
def homesindistrict(request):
    print('in ')
    city = request.GET.get('city', '')
    street_name = request.GET.get('street_name', '')
    state_rep_district = request.GET.get('state_rep_district', '')
    state_senate_district = request.GET.get('state_senate_district', '') 
    query_controller =  request.GET.get('query_controller', '') 

    if (query_controller == 'housedistricts'):
        print('querying house districts')
        homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
            filter(street_name=street_name).\
            filter(city=city).\
            filter(state_rep_district=state_rep_district)))
    elif (query_controller == 'senatedistricts'):
        print('querying senate districts')
        homesjson = serializers.serialize("json", get_list_or_404(Fullvstats.objects.\
            filter(street_name=street_name).\
            filter(city=city).\
            filter(state_senate_district=state_senate_district)))
     

    print('street name is ' + street_name)
    print('city ' + city)
    print('rep district ' + state_rep_district)
    print('senate district' + state_senate_district)


    return JsonResponse(homesjson , content_type="application/json", safe=False)



# used for house districts where user wants to get voter list with names and affiliation
# not this reuses the HTML - think about DRY with this as well as housedistricts and senatedistricts
def districtthenvoters(request):
    if request.user.is_authenticated():
        print('in districtthenvoters')
        raw_sql = """       SELECT 
                                vs.vstat_id,
                                vs.city,
                                vs.postal_city,
                                vs.street_name,
                                vs.state_rep_district,
                                vs.state_senate_district,
                                SUM(vs.rvoters) AS rvoters,
                                SUM(vs.uvoters) AS uvoters,
                                SUM(vs.mvoters) AS mvoters,
                                SUM(vs.dvoters) AS dvoters
                            FROM
                                newvoterproject.fullvstats vs
                            WHERE
                                vs.state_rep_district IN ('21', '71', '28', '19', '40', '53')
                            GROUP BY 
                                vs.city, 
                                vs.street_name, 
                                vs.state_rep_district;
                    """
        print('raw_sql = ' + raw_sql)
        vstats_table = Fullvstats.objects.raw(raw_sql)

        house_districts = ('21', '71', '28', '19', '40', '53')

        #town_list=('All towns') - eventually move this
        town_list=('21', '71', '28', '19', '40', '53')

        query_information = "RI House District Walking Lists"

        request_controller = "housedistricts"

        context = {'vstats_table': vstats_table,
                   'town_list': town_list,
                   'query_information': query_information,
                   'house_districts': house_districts,
                   'request_controller': request_controller                
                   }
        return render(request, 'elections/districtthenvoters.html', context)
    else:
        return HttpResponse("You must be logged in to see this content  :)")


# used for senate districts where user wants to get voter list with names and affiliation
# not this reuses the HTML - think about DRY with this as well as districtthenvoters, housedistricts and senatedistricts
def senatedistrictthenvoters(request):
    raw_sql = """       SELECT 
                            vs.vstat_id,
                            vs.city,
                            vs.postal_city,
                            vs.street_name,
                            vs.state_rep_district,
                            vs.state_senate_district,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvstats vs
                        WHERE
                            vs.state_senate_district IN ('19', '28', '21', '23')
                        GROUP BY 
                            vs.city, 
                            vs.street_name, 
                            vs.state_rep_district;
                """
    vstats_table = Fullvstats.objects.raw(raw_sql)

    senate_districts = ('19', '28', '21', '23')

    #town_list=('All towns') - eventually rename this and use it as a more generic parm 
    town_list=('19', '28', '21', '23')

    query_information = "RI Senate District Walking List"

    request_controller = "senatedistricts"

    context = {'vstats_table': vstats_table,
               'town_list': town_list,
               'query_information': query_information,
                'senate_districts': senate_districts,
                'request_controller': request_controller                
               }
    return render(request, 'elections/senatedistrictthenvoters.html', context)
# end senatedistrictthenvoters

# used for house districts where user wants to get voter list with names and affiliation
# not this reuses the HTML - think about DRY with this as well as housedistricts and senatedistricts
def mobiledistrictthenvoters(request):
    raw_sql = """       SELECT 
                            vs.vstat_id,
                            vs.city,
                            vs.postal_city,
                            vs.street_name,
                            vs.state_rep_district,
                            vs.state_senate_district,
                            SUM(vs.rvoters) AS rvoters,
                            SUM(vs.uvoters) AS uvoters,
                            SUM(vs.mvoters) AS mvoters,
                            SUM(vs.dvoters) AS dvoters
                        FROM
                            newvoterproject.fullvstats vs
                        WHERE
                            vs.state_rep_district IN ('21', '71', '28', '19', '40', '53')
                        GROUP BY 
                            vs.city, 
                            vs.street_name, 
                            vs.state_rep_district;
                """
    vstats_table = Fullvstats.objects.raw(raw_sql)

    house_districts = ('21', '71', '28', '19', '40', '53')

    #town_list=('All towns') - eventually move this
    town_list=('21', '71', '28', '19', '40', '53')

    query_information = "RI House District Walking Lists"

    request_controller = "housedistricts"

    context = {'vstats_table': vstats_table,
               'town_list': town_list,
               'query_information': query_information,
                'house_districts': house_districts,
                'request_controller': request_controller                
               }
    return render(request, 'elections/mobiledistrictthenvoters.html', context)



def mhome(request): 
    home = "Welcome!" 
    sitevisitor = "Guest"
    if request.user.is_authenticated():
        home = "Welcome %s!" %(request.user)  # this is needed to ensure the context is set
        sitevisitor = request.user

    context = {'home': home,
                'sitevisitor': sitevisitor
                }

    return render(request, 'elections/mhome.html', context) 

## DRY THIS UP!!!!