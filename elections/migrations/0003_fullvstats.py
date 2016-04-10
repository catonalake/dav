# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-30 04:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0002_auto_20160124_1019'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fullvstats',
            fields=[
                ('vstat_id', models.AutoField(primary_key=True, serialize=False)),
                ('street_number', models.CharField(blank=True, max_length=50, null=True)),
                ('street_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_name_2', models.CharField(blank=True, max_length=50, null=True)),
                ('unit', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('postal_city', models.CharField(blank=True, max_length=50, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=20, null=True)),
                ('zip_code_4', models.CharField(blank=True, max_length=20, null=True)),
                ('precinct', models.CharField(blank=True, max_length=50, null=True)),
                ('status', models.CharField(blank=True, max_length=50, null=True)),
                ('rvoters', models.IntegerField(blank=True, null=True)),
                ('uvoters', models.IntegerField(blank=True, null=True)),
                ('mvoters', models.IntegerField(blank=True, null=True)),
                ('dvoters', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'managed': False,
                'db_table': 'fullvstats',
            },
        ),
    ]
