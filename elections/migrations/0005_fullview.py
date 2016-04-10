# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-15 01:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0004_fullvs'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fullview',
            fields=[
                ('voter_id', models.CharField(max_length=25, primary_key=True, serialize=False)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('postal_city', models.CharField(blank=True, max_length=50, null=True)),
                ('street_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_number', models.IntegerField(blank=True, null=True)),
                ('street_name_2', models.CharField(blank=True, max_length=50, null=True)),
                ('unit', models.CharField(blank=True, max_length=50, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=20, null=True)),
                ('precinct', models.CharField(blank=True, max_length=50, null=True)),
                ('status_code', models.CharField(blank=True, max_length=50, null=True)),
                ('state_senate_district', models.CharField(blank=True, max_length=50, null=True)),
                ('state_rep_district', models.CharField(blank=True, max_length=50, null=True)),
                ('congressional_district', models.CharField(blank=True, max_length=50, null=True)),
                ('first_name', models.CharField(blank=True, max_length=50, null=True)),
                ('last_name', models.CharField(blank=True, max_length=50, null=True)),
                ('date_of_birth', models.CharField(blank=True, max_length=50, null=True)),
                ('sex', models.CharField(blank=True, max_length=50, null=True)),
                ('current_party', models.CharField(blank=True, max_length=50, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=50, null=True)),
                ('email', models.CharField(blank=True, max_length=50, null=True)),
                ('vstat_id', models.IntegerField()),
            ],
            options={
                'managed': False,
                'db_table': 'fullview',
            },
        ),
    ]