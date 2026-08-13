# AWS Account Setup (Club Guide)

## Which account should members use
Members use their own individual AWS account for club exercises. The club does not issue shared credentials, and sharing an account between members is not allowed.

## Creating your account
Sign up with a personal email you control, choose a strong unique password, and complete the identity and payment verification steps AWS asks for. Use your real name so certificates and event credits can be matched to you.

## Enable multi-factor authentication
Enable MFA on the account root user before doing anything else. Members who have not enabled MFA are asked to fix it before joining hands-on labs.

## Do not use the root user for daily work
Create an IAM user or IAM Identity Center user for everyday work and keep the root user only for account-level tasks. Never paste access keys into chat, screenshots, repositories, or the club Discord.

## Budgets and spend safety
Set a budget alert on the account as soon as it is created so you get an email if spend rises unexpectedly. The club cannot pay for or refund personal AWS charges, so shut down resources after each lab.

## Cleaning up after a lab
At the end of each workshop, delete or stop everything you created: compute instances, endpoints, storage buckets, and any managed services started during the session. The workshop facilitator walks through cleanup in the last ten minutes.

## Getting help with account problems
For account or billing problems, contact AWS Support through your own account. For club lab issues, contact the chapter lead.
