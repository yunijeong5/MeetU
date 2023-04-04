# UI Design

## Program Diagram

The following is a rough Program Diagram (or more precisely, a diagram showcasing the different technologies we plan to use, and how they might interact with each other).

Do note that the above is subject to change at any moment, andis also not completely formailzed. We just created this rough sketch as it was very helpful for us to start streamlining the entire process for developing this application, and also divide the work evenly across team members.

### **Backend Diagram**

![Wireframe 1](ProgDiagram1.png)

The above roughly showcases how we plan our backend to be laid out. Before we dive more into it, the general working of the app is as follows (and this can also be looked up in more detail under the ```../ui-design``` directory).

1. There are two main types of accounts
   1. A registered account using either Django or Google OAuth (we are primarily targeting the latter)
   2. An Unregistered account/"Guest Account"
      1. Registered accounts will be able to create and share meetings, distribute them, have a nice dashboard UI to check on all their meetings, will be able to look at past meetings, and have more features in general
      2. Guest accounts are positioned to be more general in nature, they are temporary accounts for when someone else has sent you a link to meet. All data from Guest accounts are deleted once the original meeting expires.
2. Registered accounts have a proper SQL server which is accessed using OAuth
3. Guest users have a separate SQL, just containing the details for that specific meeting, and a special identifier to identify the person. These accounts will mainly be tied using the specific URL for that meeting.

#### Frontend