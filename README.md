# Customer.io Take Home Assignment

## Running the app

To run the app follow these steps:

```
$ yarn install
$ yarn build
$ yarn start
```

## Design Decisions

### Unimplemented Features

There are some features which didn't make sense to include given the features sets to work on. For example, there was a logout button in the top right, probably based on some authentication. I chose to forgo that until given further guidance on such an addition.

### UI/UX

I took some liberty to adjust designs slightly. I removed the `Home` and `Customer` links in the header since they are both the same and can be achieved by the user clicking on the `Customer.io` text which I think is common UX for the web.

In the list view I removed the `id` in the table as it adds no real functional value to the user. If the list view were to be updated to use search, they would probably search based on the user's name, email, or job, as opposed to their id. Another thing I did here was with CSS make the email lowercase or the name of the business capitalized. Just small things here and there to bring consistency to the UI.

Given my time constraints I did not add mobile responsiveness but would collaborate with design to implement as that is critical to UX on the web.

The colors I chose are just what I had to work with Tailwind. I understand I could have added new colors to the Tailwind config but for this homework just decided to go with what was available.

I tested and created the UI/UX mainly based on the happy path and did not adjust according to errors whether from the network or the API. This also makes for bad UI/UX but would be something I would change going forward.

A nice to have even for this app would have been some sort of notification/toast message whenever there was a success on a change. Currently the user has to double check their work in order for that to happen. Not ideal.

### Code

This is not meant to be a production build in the slightest. Variables like the API url is something that should be done at build time but is hard coded right now. There are no tests for my unit functions and as I stated above just the happy path is tested in the UI. I focused more on getting it working with some decent UI. This seems like the right focus given it is a prototype.
