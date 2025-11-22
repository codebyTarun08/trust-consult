<div id="top"></div>
<div align="center">
  <h1>TrustConsult</h1>
  <h2> A Full Stack Online Consulting Platform </h2>
  <h3> Check out at https://trust-consult.vercel.app</h3>
  <p>A full-stack consultancy platform enabling clients to connect with trusted experts via real-time chat, video calling, and secure online payments.</p>
</div>

<br>

<hr>


<h2>Table of Contents</h2>

- [Project Description](#project-description)
- [Technology Used](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Data Models and Database Schema](#data-models-and-database-schema)
- [API Design](#api-design)
## Project Description
<a name="project-description"></a>
*TrustConsult is a scalable real-time consulting platform designed to help clients connect with trusted domain experts through chat and live video sessions. The application is built using the Next.js App Router and follows a modular architectural pattern, optimizing both performance and maintainability. Authentication is implemented with JWT and bcrypt to ensure secure onboarding, access control, and private communication.

*To enable real-time communication, the system uses Firebase Firestore for message storage and Firebase Realtime Database for user presence awareness. Live video consultations are powered by WebRTC, enabling peer-to-peer streaming with TURN/STUN fallback support for complex network environments. Stripe Checkout is integrated to support secure, smooth payment processing for consultation sessions.

*The platform features a responsive and modern user interface built with Tailwind CSS, offering a clean and intuitive experience across devices. Deployment is managed through Vercel for frontend edge delivery and Render for required backend operations, ensuring a globally performant and highly available system.
<hr>

## 📌 Technology Used
<a name="tech-stack"></a>

### Frontend
<a F="frontend"></a>
<p align="left"> <img src="https://img.icons8.com/color/70/000000/html-5--v1.png" width="55" title="HTML5"/> <img src="https://img.icons8.com/color/70/000000/css3.png" width="55" title="CSS3"/> <img src="https://img.icons8.com/color/70/000000/javascript--v1.png" width="55" title="JavaScript"/> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="55" title="React.js"/> <img src="https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png" width="55" title="Next.js"/> <img src="https://img.icons8.com/color/70/tailwindcss.png" width="55" title="Tailwind CSS"/> </p>

-**HTML5 →** Base structure and semantic markup for accessibility

-**CSS3 / Tailwind CSS →** Responsive, utility-first design system

-**JavaScript (ES6+) →** Interactive frontend logic

-**React.js →** Component-based UI architecture

-**Next.js (App Router) →** Server-side rendering (SSR), routing, metadata SEO

### Backend / Server
<a i="back-end"></a>
<p align="left"> <img src="https://img.icons8.com/color/70/000000/nodejs.png" width="55" title="Node.js"/> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="55" title="Express.js"/> </p>

-**Node.js →** Backend runtime for scalable application logic
-**Firebase →** Used for realtime chat and video call.

### Real-time & Database
<p align="left"> <img src="https://1000logos.net/wp-content/uploads/2024/05/Firebase-Logo.png" width="55" title="Firebase"/> </p>

-**Firebase Firestore →** Stores messages and call documents

-**Firebase Realtime Database →** Live presence system (online/offline tracking)

-**Cloudinary →** Image upload for chat messages

### Communication Layer
<p align="left"> <img src="https://webrtc.github.io/webrtc-org/assets/images/webrtc-logo-vert-retro-255x305.png" width="55" title="WebRTC"/> </p>

-**WebRTC →** Peer-to-peer video/audio streaming

-**TURN/STUN servers →** NAT traversal for reliable calling

### Payment Integration
<p align="left"> <img src="https://banner2.cleanpng.com/20180409/gqw/kisspng-stripe-payment-gateway-e-commerce-payment-system-b-strips-5acb36b2dd9799.8990945715232672509077.jpg" width="55" title="Stripe"/> </p>

-**Stripe Checkout →** Secure payment, subscription/session verification

### Deployment
<p align="left"> <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" width="55" title="Vercel"/></p>

-**Vercel →** Frontend hosting with serverless functions



### Data Models and Database Schema:
<a k="data-models-and-database-schema"></a>
The back end of TrustConsult uses a range of data models and database schemas to
manage data, including:
1. Client schema: Includes fields such as name, email, password
2. Instructor schema: Includes fields such as name, email, password, and course
details for each instructor.
3. Booking schema: Includes fields such as client Id, consultant Id , description, slot details,
and rating.


![Database Schema](public/schema.png)

<hr>
<p align="right">(<a href="#top">back to top</a>)</p>
