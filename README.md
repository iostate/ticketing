# Application Notes

## Testing
Application makes use of HTTPS being off during testing. This is set automatically by jest upon running <br>
the `jest` command.
NODE_ENV is to be set for either production or testing. <br>
NODE_ENV = 'test' # for testing<br>
NODE_ENV = 'prod' # for production.<br> 

## Hosts File
Create an entry in the /etc/hosts (mac) file to point towards the Load Balancer on Google Cloud.

Starting #153 3d4c073..c1f78a1

# Changelog
July 27th:
Changed current-user to set currentUser property on req.currentUser instead of req.session.currentUser

## Ensure the proper context is set
Skaffold was not reloading when the files changed.
Ensure that the proper context is set in the yaml configuration (skaffold.yaml)
