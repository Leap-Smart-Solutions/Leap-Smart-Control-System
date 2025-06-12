```
Page | i
```
**Graduation Project I**

**Leap: A Smart Ring for Smart Homes**

**Submitted by:**

```
Ayatullah Nabil El-Sayed El-Banhawy - 20221452375
```
```
Aysel Mahmoud Hassan Mohamed El-Masry - 20221465749
```
```
Habiba Mohammad Attia Mohammad - 20221379966
```
```
Abd El-Rahman Ahmed Mohamed Ibrahim - 20221460100
```
```
Abd El-Rahman Mohamed Abd El-Fattah Sayed - 20221459795
```
```
Mohamed Hassan Abdullah Hassouna – 20221458620
```
```
Mohamed Mostafa Kamel Raslan Ouf - 20221459902
```
```
Muhannad Khaled Abdel Mohsen El-Khouly – 20221459941
```
```
Supervised by:
Dr. Magda Madbouly
```
**Faculty of Computers and Data Science**

**Program of Computing and Data Science**

**Alexandria University**


```
Page | ii
```
**_Acknowledgment_**

Thanks God, because he's graced our lives with opportunities that we know are not of our hands
or of any other hand. He's shown us that it's a scientific fact that gratitude reciprocates. This final
moment doesn't just belong to one of us. We wouldn't be up here if it wasn't for some very
important people in our lives. To the ones who stayed with us till the moment of our achievement,
families, professors, and friends, after God for sure, we want to say

```
“Thank you all for your invaluable love, support and guidance.”
```
And for sure our special thanks go to Dr. Magda Madbouly for her supervision and assistance in
this project.

### Abstract


## Page | iii



   - 1.3 Goals and Objectives Table of Contents
- Chapter 2 : Literature Review
   - 2.1 Gesture Recognition in Smart Home Systems
   - 2.2 Facial Recognition for Home Security
   - 2.3 Chatbots for Smart Home Assistance
      - 2.3. 1 Model Selection
      - 2.3.2 Why Chavinlo/alpaca-native Model?
      - 2.3.3 Challenges in Chatbot Development
      - 2.3.4 Text-to-Speech and Speech Recognition in Conversational AI
   - 2.5 Integration of Smart Home Technologies
      - 2.5.1 System Integration Challenges
      - 2.5.2 Prior Work in Smart Home Integration
   - 2.6 Gaps in Existing Systems
- Chapter 3: System Design and Methodology
   - 3.1 Overview of the System Architecture
   - 3.2 Gesture Recognition System
   - 3 .3 Facial Recognition System
   - 3.4 Chatbot System
   - 3.5 Datasets
   - 3.6 Data Preprocessing
   - 3.7 Choosing Learning Algorithm
   - 3.8 Data Modeling
      - 3.8.1 RCE NN and Dynamic Time Warping for Gesture Recognition
      - 3.8.2 Siamese Network for Facial Recognition
      - 3.8.3 Chatbot Model Using Hugging Face Transformers
      - 3.8.4 Integration of Gesture, Facial Recognition, and Chatbot
   - 3. 9 Toolset Overview
- Chapter 4: Development
   - 4.1 System Requirements Page | iv
      - 4.1.1 Functional Requirements
      - 4.1.2 Non-Functional Requirements
   - 4.2 Software Model: Agile Methodology
      - 4.2.1 Introduction to Agile Methodology
      - 4.2.2 Features of Agile Methodology
      - 4.2.3 Suitability of Agile to The Leap Project
      - 4.2.4 Phases of Agile Methodology for The Leap Project
      - 4.2.5 Methodology
   - 4.3 Website
      - 4.3.1.2 User Interface and User Experience (UI/UX)
      - 4.3.1. 3 UI for User Information Form Page
   - 4.4 Mobile Application
      - 4.4.1 Platform Selection
      - 4.4.2 App Development
   - 4.5 Databases
      - 4.5.1 Database Design
   - 4.3.3 Backend Development
      - 4.3.3.1 Tools and Technologies
      - 4.3.3.2 Backend Design Pattern
      - 4.3.3.3 Authentication and Authorization
      - 4.3.3.4 Users Management System
      - 4.3.3.5 Orders Management System
      - 4.3.3.6 Issues Management System
      - 4.3.3.7 Items Management System
      - 4.3.3.8 Inventory Management System
      - 4.3.3.9 Automated Email Invoicing
      - 4.3.3.10 Real-Time Database and IoT Integration
      - 4.3.3.11 Backend Testing

- Chapter 5: IoT Devices
   - 5.1 Smart Rings
      - 5.1.1 Hardware Components and Justification
   - 5.2 Smart Band
      - 5.2.1 Use Case:
      - 5.2.2 Hardware Components and Justification
      - 5.2.3 Software
   - 5.3 Smart Switch
      - 5.3.1 Use Case
      - 5.3.2 Hardware Components and Justification
      - 5.3.3 Software
   - 5.4 Live Stream Camera
   - 5.4.1 Use Case Page | v
   - 5.4.2 Hardware Components
   - 5.4.3 Software Setup
- Figure 2.3.1: Rule-based chatbots List of Figures
- Figure 3.1: Workflow Diagram of the Leap Ring
- Figure 3.2: Workflow Diagram of the Leap Facial Recognition System.................................
- Figure 3.3: Workflow Diagram of the Leap Chatbot System...................................................
- Figure 3.8.1 Structure of a RCE neural network....................................................................
- Figure 3. 8 .2: A simple 2 hidden layer of Siamese network....................................................
- Figure 4.2.4: Agile Phases
- Figure 4.3.2.2.1 Admin login
- Figure 4.3.2.2.2 Admin |Users
- Figure 4.3.2.2.2 Admin |Orders
- Figure 4.3.2.2.3 Admin |Issues
- Figure 4.3.2.2.4 Admin |Items
- Figure 4.3.2.2.5 Admin |Inventory
- Figure 4.3.2.2.6 Admin |Settings
- Figure 4.3.2.3.1 Landing Page
- Figure 4.3.2.3.2 Signup Page, email and phone number verification
- Figure 4.3.2.3.3 Login
- Figure 4.3.2.3.4 Shopping Page
- Figure 4.3.2.3.5 Order Details
- Figure 4.3.2.3.6 Chek Out Page
- Figure 4.3.2.3.7 Create issues Page
- Figure 4.3.2.3.8 Livingroom Page
- Figure 4.3.2.3.9 Profile Page
- Figure 4.4.2.1: mobile UI...............................................................................
- Figure 5.1: Ring circuit...................................................................................


```
Page | vi
```
```
Figure 5.2: Ring PCB..................................................................................... 41
Figure 5.3: Ring Charger ................................................................................. 42
Figure 5.4: Smart Switch circuit..........................................................................4 3
Figure 5. 5 : Smart Door Lock circuit......................................................................4 4
```
**_List of Abbreviations_**

**Abbreviation Definition**

```
CNN Convolutional Neural Network
```
```
LFW Labelled Faces in the Wild
```
```
NLP Natural Language Processing
```
```
IoT Internet of Things
```
```
SER Speech Emotion Recognition
```
```
ASR Automatic Speech Recognition
```
```
ML Machine Learning
```
```
DL Deep Learning
```
```
AI Artificial Intelligence
```
```
API Application Programming Interface
```
```
UI User Interface
```
```
UX User Experience
```
```
ESP-NOW Expressive Wireless Communication Protocol
```
```
SVM Support Vector Machines
```
```
k-NN k-Nearest Neighbors
```

```
Page | vii
```
**IMU** Inertial Measurement Unit

**SR** Speech Recognition

**RCE** Restricted Coulomb Energy

**DTW** Dynamic Time Wrapping

**JS** JavaScript

**Wi-Fi** Wireless Fidelty

**OpenCV** Open-Source Computer Vision

**LBP** Lower Boundary Point

**DPDT** Double Pole Double Throw


**_Chapter 1_**

**_Introduction_**

### 1.1 Problem Statement

Today, most smart home systems are almost exclusively dependent on voice commands
and mobile applications as their primary interface. These interfaces, effective for most users, create
a big accessibility barrier for people with disabilities, such as speech impairments, or in noisy
environments where voice recognition systems usually fail. Moreover, mobile applications need a
smartphone and technical competence in using complicated interfaces, which could be an
especially difficult task for an older adult or somebody with poor technological literacy.

Another major problem is the lack of interoperability and integration among different smart home
systems. To be sure, most of the already existing solutions are built in silos; that is, their separate
devices and applications work in isolation, governing different functionalities such as security,
automation, and health monitoring. This leads to a fragmentation that causes inefficiencies,
increases costs, and creates a poor user experience, making it hard for the users to manage their
ecosystem in the smart home efficiently. This shows the requirement for an innovative solution
able to address accessibility concerns, offer seamless interaction, and integrate diverse
functionalities into one coherent system.

### 1.2 Motivation and Justification

The project is motivated by the requirement to design an inclusive, accessible, and user-
friendly approach to smart home automation. It looks into the challenges posed by the current
systems and seeks to provide a solution that combines innovation with practicality. Equipped with
gesture recognition, this smart ring makes it possible for one to control his or her smart home
devices most naturally and intuitively—especially for people who have difficulties with voice
commands or even mobile interfaces.

The integrated facial recognition system also allows for added security in personalized access and
sends instant alerts in the event of unauthorized entries. Meanwhile, the conversational AI-
powered chatbot responds to the users with instant help, answers to questions, and personalized
suggestions, hence enhancing the experience. To make all these features easily accessible and
manageable, the project entails a website and mobile application as core platforms. These
platforms serve as single-control dashboards where users can set up and monitor their devices
easily, either at home or remotely.


### 1.3 Goals and Objectives

Leap is designed to redefine the field of smart home automation with the first integrated,
user-centered system in merging gesture recognition, facial recognition, and conversational AI
with IoT technologies. The ultimate goal is to provide a seamless, secure, and accessible solution,
delivering a better experience in the interaction between users and their living environment.

The core part of this project will be the development of a smart Ring that can recognize and
interpret hand gestures. This feature overcomes some of the drawbacks of using traditional control
methods, such as voice commands and mobile apps, by offering an intuitive, hands-free alternative
able to respond to a wide array of user needs, including persons with disabilities or being in noisy
environments. With accuracy and responsiveness assured, this gesture recognition system will
allow for the effortless control of smart home devices such as lighting, thermostats, and security
systems.

This would further enhance home security with a state-of-the-art facial recognition system. Using
TensorFlow, OpenCV, and Keras, this module is going to be able to identify authorized persons in
real time and alert the homeowner about any unauthorized entry; it would adapt to changing
lighting conditions in order to guarantee consistent performance. All these really make the smart
home experience quite safer and much more tailored.

The conversation will be even richer with the aid of a conversational AI-driven chatbot that will
offer live help, responding to queries and giving recommendations as needed. Available via both
voice and text, this chatbot will become the easy-to-use interface for all smart home devices and
support requests.

The Leap project will also have its mobile application and website, developed for the management
of the system in a centralized way. It would be used in the control of devices, interacting with the
chatbot, setting of security, and monitoring the system's performance. A strong focus will be put
on making the platforms user-friendly, accessible, and compatible on a wide variety of devices to
make smart home management easy for everyone.

The architecture of IoT will be the backbone in ensuring seamless communication between the
smart Ring, facial recognition system, chatbot, and connected devices. Firebase will be utilized in
achieving real-time data synchronization, while ESP-NOW and Wi-Fi will be used for low-latency
communication. The architecture will provide reliable, scalable operation with the possibility of
adding more devices and features to the system in the future.

The Leap project is uniting all these technologies with the view to achieve a holistic and adaptive
solution able to handle changing demands from today's smart home for which there must be
accessibility, security, and usability for all types of users.


**_Chapter_** **2**

**_Literature Review_**

The **Leap project** builds upon a rich foundation of research and technological
advancements in the fields of gesture recognition, facial recognition, chatbot development, and
smart home automation. This chapter provides a comprehensive review of the existing literature,
highlighting the key technologies, methodologies, and challenges that have shaped the
development of the Leap system. By examining prior work, this chapter positions the Leap project
within the broader context of smart home technologies and identifies the gaps that the project aims
to address.

### 2.1 Gesture Recognition in Smart Home Systems

Gesture recognition plays a pivotal role in enhancing user interaction within smart home
environments. Among the various techniques available, wearable sensors have emerged as a
practical solution for capturing and interpreting gestures. Devices such as rings and wristbands
equipped with inertial measurement units (IMUs) are widely used in this domain. These sensors
can detect motion data, including acceleration and angular velocity, enabling real-time gesture
recognition. The Leap project capitalizes on this technology by incorporating IMU sensors into
wearable devices, ensuring intuitive and seamless gesture control for users [1].

Camera-based gesture recognition, another widely adopted approach, relies on optical devices and
machine learning algorithms to identify user movements. Although this technique offers high
accuracy, it often requires significant computational resources and well-lit environments for
optimal performance. These limitations make camera-based systems less ideal for smart home
settings where power efficiency and adaptability are crucial [2].

A promising alternative is the use of hybrid systems that combine the strengths of multiple
technologies. For example, systems that integrate IMU sensors with depth cameras can improve
recognition accuracy while reducing dependency on environmental factors. However, these
solutions pose challenges related to system complexity and cost, which must be carefully managed
during implementation.

Despite the advancements in gesture recognition technologies, significant challenges remain. Real-
time performance, variability in user gestures, and the need for robust algorithms to handle noise
in sensor data are persistent issues. Addressing these challenges is essential for the Leap project to
deliver a reliable and user-friendly smart home system.


### 2.2 Facial Recognition for Home Security

Facial recognition has become a cornerstone of modern home security systems due to its
contactless nature, automation capability, and user-friendly interface. Unlike traditional security
measures (e.g., keys, cards, or PINs), face-based authentication offers a seamless experience while
maintaining high security standards.

Early facial recognition techniques, such as **Eigenfaces** , **Fisherfaces** , and **Local Binary Patterns
(LBP)** , played a foundational role in the evolution of the field. However, these approaches suffered
from significant limitations, particularly their sensitivity to environmental factors such as lighting
variation, pose differences, occlusions, and facial expressions [5]. These shortcomings hindered
their applicability in dynamic real-world settings like smart homes.

The shift toward **deep learning** brought a major breakthrough in facial recognition accuracy and
robustness. Pioneering models such as **FaceNet** [6] and **DeepFace** [10] demonstrated that facial
embeddings generated via deep convolutional neural networks could reliably distinguish
individuals, even under adverse conditions. These models map facial images into high-dimensional
embedding spaces where similar faces lie close together, enabling both **identification** and
**verification** with high precision.

In the **initial phase** of the **Leap Smart Home Face Recognition Project** , a **Siamese Neural
Network** was adopted to explore **one-shot learning** for identity verification. This approach was
particularly suited for scenarios with limited data per individual, using the triplet-based strategy of
_anchor_ , _positive_ , and _negative_ samples [7,11]. While effective for small-scale testing, this approach
faced challenges in generalization, scalability, and real-time inference.

To address these limitations, the **second phase** of the Leap project introduced a **production-grade
pipeline** using:

```
YOLOv8 for real-time face detection.
VGGFace2-based embedding model for identity representation.
Cosine similarity for rapid and accurate recognition.
```
The combination of **YOLOv8** and **VGGFace2** ensures **robustness** , **speed** , and **scalability**.
YOLOv8 enables fast and precise localization of faces in varied lighting and pose conditions, while
VGGFace2 embeddings offer deep feature extraction that generalizes well across demographics
and facial variations.

Another key concern in face recognition systems— **privacy and data protection** —has been
carefully addressed in the Leap project. All biometric data is processed locally when possible, and
sensitive embeddings are securely stored. The system architecture follows **Privacy by Design**
principles [9], with optional encryption and restricted access to the face database. Furthermore, the
system includes **real-time alert mechanisms** for unauthorized access attempts, increasing trust
and safety for end users.

From a deployment perspective, **real-time performance** is paramount. The Leap project ensures
low-latency operation through a combination of:


```
ONNX-based lightweight models
Hardware acceleration (GPU-compatible where available)
Cloud synchronization using Firebase
```
This hybrid architecture supports both **offline operation** for reliability and **cloud capabilities** for
synchronization, user alerts, and cross-platform accessibility.

### 2.3 Chatbots for Smart Home Assistance

Chatbots have become an integral part of modern smart home systems, providing users with real-
time assistance and personalized recommendations using text or speech. Powered by natural
language processing (NLP) models, chatbots can understand and respond to user queries in natural
language, making them a valuable addition to the Leap project.

```
Figure 2.3.1: Rule-based chatbots
```
**2.3.1 Evolution of Chatbots and the Advantages of Modern Systems**

The development of chatbots has undergone a remarkable transformation, evolving from

rudimentary rule-based systems to highly advanced conversational agents powered by large
language models (LLMs). Early chatbots, such as ELIZA (1966), relied on predefined scripts and
rule-based algorithms to generate responses. While these systems were simple to implement, they
were constrained by their inability to handle complex or dynamic queries, as they lacked the
flexibility to adapt to unexpected user inputs.

Advancements in artificial intelligence and machine learning led to the emergence of retrieval-
based chatbots. These systems utilized machine learning techniques to identify and retrieve the


most relevant responses from a predefined dataset. Although this approach improved
conversational relevance and adaptability, it was still limited by its dependence on a fixed pool of
responses, lacking the ability to generate novel content.

The introduction of generative chatbots marked a pivotal shift in the capabilities of conversational
AI. Powered by neural networks and early transformer models, such as sequence-to-sequence
(Seq2Seq) models, these systems could generate original responses based on input context.
Examples include Google's Meena and OpenAI's GPT-2, which showcased significant
improvements in dialogue coherence and contextual understanding. However, these systems faced
challenges in maintaining factual accuracy and handling multi-turn conversations effectively.

Modern chatbots, exemplified by advanced LLMs such as ChatGPT, BERT, and Claude, represent
the latest evolution in chatbot technology. These models leverage transformer-based architectures
trained on extensive datasets, enabling them to process multi-turn interactions, understand context
deeply, and produce human-like, contextually relevant responses. Fine-tuned on domain-specific
data, these chatbots excel in a wide range of applications, from scheduling and financial analysis
to educational tools and customer support.

The key advantages of modern systems lie in their flexibility, scalability, and personalization.
Unlike their predecessors, these chatbots can adapt to diverse domains, support multilingual
interactions, and personalize responses based on user preferences and historical data. Moreover,
their seamless integration with IoT devices and edge computing allows for real-time decision-
making and reduced latency, making them ideal for smart home systems and other interactive
environments.

This progression from simple rule-based algorithms to sophisticated LLMs underscores the
continuous advancements in chatbot technology. Modern systems offer unparalleled capabilities,
combining contextual understanding, generative proficiency, and multi-domain adaptability,
making them indispensable tools for both personal and professional applications.

**2.3.2 Model Selection**

**Why Chavinlo/alpaca-native Model?**

The "chavinlo/alpaca-native" model was chosen for its advanced capabilities in generating
coherent and contextually relevant text, making it ideal for conversational AI tasks. Its instruction-
tuning ensures a deep understanding of user input, enabling natural and dynamic interactions that
closely mimic human conversation. The model's architecture is optimized for efficiency, providing
fast inference and low resource consumption, which are critical for real-time applications. This
balance between performance and computational efficiency ensures high responsiveness without
compromising on the quality of language understanding and generation.


Moreover, the model integrates seamlessly with the Hugging Face ecosystem, a platform known
for its extensive tools and community support. This compatibility facilitates easy customization
and scalability, allowing the model to be fine-tuned for domain-specific tasks with minimal effort.
The combination of advanced text generation, real-time performance, and adaptability makes
"chavinlo/alpaca-native" a robust and versatile choice for building conversational agents in
complex and interactive environments.

#### 2.3.3 Challenges in Chatbot Development

- **Contextual Understanding** : Chatbots must maintain context across multiple turns in a
    conversation to provide coherent and relevant responses. This requires sophisticated
    models capable of capturing long-term dependencies. The Leap project addresses this by
    integrating advanced NLP models that maintain context throughout user interactions.
- **Personalization** : To enhance user experience, chatbots should be able to personalize
    responses based on user preferences and historical interactions. This requires the
    integration of user profiling and recommendation systems. The Leap project will
    incorporate personalization features to tailor the smart home experience to individual users.
- **Real-Time Performance** : Chatbots must respond to user queries in real-time, with
    minimal latency, to ensure a smooth and engaging interaction. The Leap system will
    achieve this by optimizing communication protocols and leveraging Firebase for real-time
    data synchronization.

### 2.4 Text-to-Speech and Speech Recognition in Conversational AI

Text-to-Speech (TTS) and Speech Recognition (SR) technologies are fundamental components of
modern conversational AI systems, enabling seamless interaction between users and machines.
Speech recognition systems, such as Python's speech_recognition library, facilitate the conversion
of spoken language into text, allowing chatbots to process and understand verbal queries. These
systems rely on advanced acoustic modeling and natural language processing to handle variability
in speech, such as accents, noise, and diverse languages, ensuring accurate transcription for real-
time applications.

Text-to-Speech systems, such as Google Text-to-Speech (gTTS), complement SR by converting
textual responses generated by the chatbot into natural-sounding speech. This bidirectional
capability enhances user experience by providing an interactive and human-like communication
interface. The integration of TTS and SR enables applications such as voice-controlled systems,
accessibility tools, and interactive customer service.

To optimize these functionalities, preprocessing tools like pydub are employed for audio
manipulation, including format conversion, trimming, and enhancing sound quality. Real-time
performance is achieved by leveraging efficient libraries and cloud-based solutions, such as
Firebase, for data synchronization and latency minimization. Together, TTS and SR technologies


form the backbone of voice-enabled AI systems, driving advancements in accessibility, user
engagement, and interaction efficiency.

### 2.5 Integration of Smart Home Technologies

The integration of gesture recognition, facial recognition, and chatbot technologies into a unified
smart home system presents both opportunities and challenges. While each technology has its own
strengths, combining them into a cohesive system requires careful design and implementation.

#### 2.5.1 System Integration Challenges

- **Interoperability** : Ensuring that different components of the system, such as the smart
    Ring, facial recognition system, and chatbot, can communicate seamlessly is critical. This
    requires the use of standardized communication protocols and APIs [19]. The Leap project
    employs a modular architecture with layered communication protocols to ensure seamless
    interoperability.
- **Scalability** : The system must be scalable, allowing for the addition of new devices and
    functionalities in the future. This requires a modular architecture that can accommodate
    changes without disrupting existing operations [20]. The Leap project is designed with
    scalability in mind, enabling future expansions such as voice assistant hardware and
    advanced health monitoring features.
- **User Experience** : The integration of multiple technologies must not compromise the user
    experience. The system should provide a consistent and intuitive interface across all
    components [21]. The Leap project prioritizes user-centric design, ensuring that the system
    is easy to use and accessible to all users.

#### 2.5.2 Prior Work in Smart Home Integration

- **Unified Control Platforms** : Several smart home platforms, such as Google Home and
    Amazon Alexa, have attempted to integrate multiple control methods, including voice
    commands, mobile apps, and gesture recognition. However, these platforms often lack the
    depth of integration and personalization offered by the Leap project [22].
- **Wearable Devices for Smart Homes** : Wearable devices, such as smartwatches and fitness
    trackers, have been explored as control mechanisms for smart homes. However, these
    devices are often limited in their functionality and do not offer the same level of precision
    and customization as the smart Ring [23]. The Leap project addresses this limitation by
    introducing gesture-based rings and a smart band as the central hub for home automation.

### 2.6 Gaps in Existing Systems

Despite the advancements in gesture recognition, facial recognition, and chatbot technologies,
several gaps remain in existing smart home systems:


1. **Limited Inclusivity** : Many smart home systems rely heavily on voice commands and
    mobile apps, which may not be suitable for users with disabilities or those in noisy
    environments. The Leap project addresses this gap by offering gesture-based control as an
    inclusive alternative.
2. **Fragmentation** : Existing systems often operate in silos, with separate devices and
    applications for different functionalities. This fragmentation leads to inefficiencies and a
    lack of integration. The Leap project integrates gesture recognition, facial recognition, and
    chatbot technologies into a unified system, providing a seamless user experience.
3. **Energy Efficiency** : Wearable devices and other hardware components must be energy-
    efficient to ensure continuous operation. Many existing systems fail to prioritize power
    management, leading to frequent recharging or battery replacements. The Leap project
    optimizes energy consumption through efficient hardware design and firmware
    optimization.


**_Chapter 3_**

**_System Design and Methodology_**

This chapter provides an in-depth overview of the system design, and the methodology
employed in the Leap project. It elaborates on the integration of the gesture recognition system,
facial recognition system, and the chatbot, each of which plays a critical role in the smart ring-
based control system. The chapter explains the architecture, workflow, datasets, data preprocessing
techniques, model selection, and tools used in developing the Leap system.

### 3.1 Overview of the System Architecture

The Leap system has a modular architecture that is scalable, flexible, and hence easy to integrate
into the framework of smart home control. It contains three main components performing different
roles in the framework:

The **first** is the smart ring that performs gesture recognition with sensors mounted on it detecting
hand movements. Information relayed from the sensors is passed on to a central processing unit,
the smart band, where the information captured is processed to identify certain gestures. The smart
ring wirelessly communicates with the band using low-power communication protocols such as
ESP-NOW.

The **second** is the facial recognition system, where pictures taken by a camera identify the user
with the help of a Siamese Neural Network. It's a real-time system, giving instant feedback, hence
useful for security. It ensures privacy and reduces latency since it processes data locally. Face
detection is done using OpenCV, while the Siamese Neural Network is built and trained using
TensorFlow and Keras, respectively, with the Labelled Faces in the Wild (LFW) dataset. It is
designed to cope with lighting, pose, and facial expression variations to perform well in real-world
conditions.

The **third** major element is the chatbot system, which is run using the Hugging Face Transformers
library. It uses the "chavinlo/alpaca-native" model to come up with responses that sound very much
like those of a human, thus giving live assistance to users. The chatbot will interact through both
text and voice commands via a mobile application and website to give personalized
recommendations and control smart home devices.


The app and the website are the main interfaces of the Leap system: they are how users will
configure and control their smart home devices, interact with the chatbot, and set security
preferences—basically, user-friendly interfaces designed to ensure accessibility on all kinds of
devices.

### 3.2 Gesture Recognition System

The gesture recognition system relies on the smart rings, which captures hand gestures using
Inertial Measurement Units (IMUs) embedded in the ring. These IMUs provide data on
acceleration, and angular velocity. The
captured data is transmitted to the smart
band, which processes the data to
identify predefined gestures. The
system is designed to recognize
gestures related to controlling various
smart home devices, such as turning
lights on/off, adjusting the thermostat,
and locking/unlocking doors.

The recognition model is trained using
a custom dataset of hand gestures
collected, with each gesture performed
multiple times to account for variability.
This dataset includes a total of 1, 0000
records, which undergo preprocessing
techniques such as normalization,
filtering, and data augmentation to
improve the model's robustness and
prevent overfitting. The model itself
uses Dynamic Time Warping (DTW)
technique and RCE (Restricted
Coulomb Energy) Neural Network to
capture spatial patterns in the gesture
data, enabling accurate recognition of
complex hand movements.

```
Figure 3.1: Workflow Diagram of the Leap
Ring
```
### 3 .3 Facial Recognition System


```
Page | 12
```
```
Figure 3. 3 : Workflow Diagram of the Leap Chatbot System
```
The Leap Facial Recognition System enables real-time, secure identification using deep learning.
Upon system startup, the camera interface continuously captures live frames. Once a person
appears in view, an image is taken and passed to a YOLOv8-based detector to accurately localize
the face under various lighting and pose conditions. The detected face is then cropped and
processed by a pretrained VGGFace2 model, which extracts a 512-dimensional embedding vector
representing the person's identity.

This embedding is compared to a database of known embeddings using cosine similarity. If the
similarity exceeds a set threshold, access is granted; otherwise, the person is marked as unknown,
and access is denied. In cases where no face is detected, the system also denies access and displays
an error.

Preprocessing steps such as face cropping, resizing, and normalization are applied to enhance
accuracy. During registration, data augmentation techniques—including minor rotations and
brightness changes—improve robustness. All models are deployed in ONNX format with
hardware acceleration to ensure efficient performance, even on low-power devices.

The system marks a transition from an earlier Siamese-based prototype to a scalable, high-
accuracy architecture using YOLOv8 and VGGFace2. It supports both offline and cloud-linked
modes (e.g., Firebase) for real-time alerts and remote monitoring. The updated workflow is
illustrated in Figure 3.2.

### 3.4 Chatbot System

```
The Leap system's chatbot is designed to provide users with interactive assistance and
personalized recommendations. It
is powered by the Hugging Face
Transformers library and uses
the"chavinlo/alpaca-native" model
for natural language processing
(NLP). The chatbot processes user
queries related to smart home
control, answering questions and
executing commands based on
user input. The model is trained on
a dataset of conversational data,
which includes queries related to
smart home management and
```

```
security settings. Preprocessing for the chatbot data includes tokenization, where sentences are
broken into words or sub-words, followed by padding to standardize the input length. This
enables efficient training and consistent performance across different input queries. The
chatbot is accessible through both text and voice commands, ensuring flexibility in user
interactions.
```
### 3.5 Datasets

The Leap project utilizes the following datasets for training and evaluation:

1. **Custom Gesture Dataset** :

```
A custom dataset of hand gestures was created using the smart Rings. The dataset
includes gestures for controlling various smart home devices, such as turning lights on/off,
adjusting the thermostat, and locking/unlocking doors. The dataset contains 1, 0000
records collected, with each gesture performed multiple times to ensure variability.
```
2. **Chatbot Training Data** :

```
The chatbot is trained on a dataset of conversational data, including user queries
and responses related to smart home control. The dataset is preprocessed to remove noise
and ensure consistency.
```
### 3.6 Data Preprocessing

Data preprocessing plays a crucial role in enhancing the accuracy and reliability of the Leap system
by preparing raw data for effective model training. For the gesture data, preprocessing involves
several techniques to improve the quality and consistency of the input. First, normalization is
applied to ensure uniform scaling across different sensors and users. Filtering is used to remove
noise and outliers through filters such as Butterworth or Kalman, while data augmentation
techniques, including rotation, scaling, and time warping, help increase dataset variability and
reduce the risk of overfitting. In the case of facial data, preprocessing steps focus on improving
the model's ability to recognize faces under various conditions. Facial images are cropped to isolate
the face region and eliminate irrelevant background, then resized to a standard resolution of
105x105 pixels for uniformity. Normalization is performed on the pixel values, adjusting them to
the [0, 1] range to optimize model convergence. Additionally, data augmentation, such as random
rotations, flips, and brightness adjustments, enhances the model's robustness. For chatbot data,
preprocessing primarily involves tokenization, which splits the conversational text into words or
sub-words, followed by padding to ensure consistent input size, thus allowing the model to handle
varying query lengths efficiently. These preprocessing techniques collectively enable the Leap
system to effectively train and deploy accurate models across its gesture recognition, facial
recognition, and chatbot components.


### 3.7 Choosing Learning Algorithm

The Leap project incorporates a combination of traditional machine learning and deep
learning algorithms to optimize accuracy and real-time performance across various tasks. In the
early stages of development, traditional machine learning techniques were employed, including
Support Vector Machines (SVM) for gesture recognition due to their simplicity and effectiveness
with smaller datasets, and k-Nearest Neighbors (k-NN) for facial recognition, which was later
replaced by deep learning models for improved performance. As the project evolved, deep learning
algorithms became central to the system's functionality. RCE (Restricted Columb Energy) and
DTW (Dynamic Time Wrapping) technique for gesture recognition to capture spatial patterns
within the gesture data, while Siamese Neural Networks were employed for facial recognition,
enabling efficient comparison of facial features with minimal training data. For the chatbot
component, Transformers were used to generate human-like responses based on user queries,
enhancing the conversational capabilities of the system. A comparison of machine learning and
deep learning highlights that while deep learning models generally outperform traditional
algorithms in accuracy, particularly for complex tasks like gesture and facial recognition, they
come with higher computational requirements and the need for larger datasets. Despite these
demands, deep learning models, when properly optimized, can still deliver real-time performance
suitable for smart home applications. The decision to focus on deep learning was driven by its
superior accuracy, robustness, and the availability of pre-trained models and frameworks, such as
Pytorch, TensorFlow and Hugging Face, which streamline the development process and align with
the project's requirements for high performance and scalability.

### 3.8 Data Modeling

#### 3.8.1 RCE NN and Dynamic Time Warping for Gesture Recognition

The Restricted Coulomb Energy Neural Network (RCE NN), when combined with Dynamic Time
Warping (DTW), offers an efficient and accurate approach for gesture recognition, particularly for
time-series data.

```
Figure 3.8.1. Structure of an RCE neural network.
```

**3.8.2 Embedding-Based Face Recognition using VGGFace2**

In the current phase of the Leap system, facial recognition is performed using a deep embedding-
based approach, replacing the earlier Siamese network architecture. This method leverages a
pretrained VGGFace2 model to extract high-dimensional feature embeddings from detected facial
images. These embeddings represent the unique identity of each individual and allow for accurate
comparison without the need to retrain the model for every new user.

The VGGFace2 model, trained on over 3.3 million images, is capable of encoding subtle facial
features into a 512-dimensional vector. During recognition, a face is first detected using the
YOLOv8 model, cropped, preprocessed, and passed through the embedding model. The resulting
vector is then compared to stored vectors in the system's face database using cosine similarity. If
the similarity exceeds a defined threshold, the identity is considered a match; otherwise, the
individual is marked as unknown.

This approach significantly enhances recognition accuracy, generalization, and system scalability.
Unlike traditional classification-based models, embedding-based recognition allows the system to
add new users without retraining. It is also robust to variations in lighting, angle, and facial
expressions, making it highly suitable for real-world smart home environments.


#### 3.8.3 Chatbot Model Using Hugging Face Transformers

- The chatbot is powered by the **"chavinlo/alpaca-native"** model from Hugging Face. The
    model is fine-tuned on the chatbot training data to generate contextually relevant responses.

#### 3.8.4 Integration of Gesture, Facial Recognition, and Chatbot

- The three components are integrated into a unified system using **Firebase** for real-time
    data storage and synchronization. The mobile application and website serve as the central
    interface for user interaction.

### 3.7 Toolset Overview

The Leap project utilizes a diverse set of tools and technologies to ensure the development
and deployment of an efficient and scalable system. **Python** serves as the primary programming
language, chosen for its versatility and robust ecosystem of libraries. For facial recognition, the
current implementation replaces the earlier TensorFlow-based Siamese network with a modular
pipeline consisting of **YOLOv8** for real-time face detection and a **VGGFace2-based embedding
model** for identity recognition. These models are integrated using **ONNX Runtime** , which enables
high-speed inference across various hardware environments. Additional support is provided by
**OpenCV** for image preprocessing and manipulation.

Libraries such as **TensorFlow** and **Keras** are still employed for building and training the gesture
recognition models, enabling the system to effectively learn and process motion-related data.
**Hugging Face Transformers** are utilized to develop the chatbot, enabling it to generate human-
like responses and enhance the interaction experience. **Firebase** plays a crucial role in the system
by providing real-time data storage and synchronization, ensuring seamless communication
between the smart ring, facial recognition system, and chatbot. For backend development, **Node.js**
and **Express.js** are used to build and manage the website and mobile application, allowing for
efficient handling of user requests and ensuring smooth integration with the other components of


the system. This combination of tools facilitates the development of a comprehensive system that
can deliver real-time, intelligent performance.

**_Chapter 4_**

**_Development_**

### 4.1 System Requirements

#### 4.1.1 Functional Requirements

The functional requirements define the core capabilities that the Leap system must offer to ensure
its success in meeting user needs.

**First** , the Leap system employs a multi-sensor setup designed to ensure precise data acquisition
and effective gesture recognition, crucial for meeting user needs. The system features three sensors
positioned on individual fingers and one sensor configured as a bracelet on the forearm. This
strategic configuration serves multiple purposes:

Fine-Grained Motion Detection: Sensors on the fingers provide precise measurements of
individual finger movements, allowing for the accurate identification of gestures with high fidelity.

Global Muscle Activity Tracking: The forearm sensor captures broader muscle activation patterns,
enriching the dataset with complementary signals that reflect overall arm dynamics.

Enhanced Data Reliability: The integration of multiple sensors enables cross-validation of signals,
mitigating noise or inaccuracies from any single sensor, thus improving the overall reliability and
robustness of the data.

Comprehensive Gesture Recognition: By combining localized data from the finger sensors with
global data from the forearm sensor, the system achieves a holistic understanding of hand and
finger gestures, crucial for distinguishing complex or subtle gestures.

This sensor configuration ensures a diverse and robust dataset, which enhances the training of
advanced machine learning algorithms. As a result, the data quality improves the accuracy and
reliability of the gesture recognition system, laying a solid foundation for real-world applications,
particularly in controlling smart home devices.

The core functionality of the Leap system revolves around its ability to accurately detect and
interpret predefined hand gestures. These gestures are integral to controlling smart home devices,
with real-time feedback provided to confirm the recognition of gestures and the execution of


commands. This capability is essential for delivering an intuitive and seamless user experience,
ensuring the system meets user expectations effectively.

**Second** , **the facial recognition system** must be capable of detecting and recognizing faces in real-
time using a webcam or camera sensors. The system must be trained on a dataset of known
individuals, allowing it to verify authorized users and distinguish them from unauthorized
individuals. If unauthorized access is detected, the system should send real-time notifications to
the homeowner, alerting them to potential security breaches.

**The chatbot** functionality is another crucial component. The chatbot must understand user queries
expressed in natural language and provide relevant responses. Additionally, the chatbot should be
able to offer personalized recommendations based on the user's preferences and historical data,
improving the overall user experience.

**The mobile** application and website must provide user-friendly interfaces that allow users to
control their smart home devices, interact with the chatbot, and manage security settings. These
interfaces should be designed to be accessible on a variety of devices, including smartphones,
tablets, and desktop computers, ensuring flexibility and convenience for the user.

**Lastly** , the system must seamlessly integrate the gesture recognition, facial recognition, and
chatbot functionalities into a unified platform using IoT technologies. Communication between
the smart ring, facial recognition system, chatbot, and smart home devices should be supported via
reliable technologies such as ESP-NOW, Wi-Fi, and Firebase, enabling smooth and efficient
operation.

#### 4.1.2 Non-Functional Requirements

The nonfunctional requirements detail the overall qualities that the Leap system must embody to
ensure its success in real-world applications.

**Security** is a primary consideration. The system must encrypt user data and ensure that all
communication between devices is secure to protect user privacy. The facial recognition system
must store sensitive user data securely and comply with applicable data protection regulations to
ensure that user information is kept safe.

**Performance** is another critical requirement. The system must be responsive, with minimal
latency during gesture recognition, facial recognition, and chatbot interactions. It should provide
real-time responses to user inputs and be able to handle multiple users and devices simultaneously
without any noticeable performance degradation. This is essential for maintaining a smooth and
uninterrupted user experience, even in more complex environments.

**Usability** is also a key factor for the system's success. The system must be easy to use, with
intuitive interfaces for the smart ring, mobile application, and website. It should provide clear
feedback to users, confirming that gestures have been recognized, facial recognition has been
successful, and chatbot responses have been processed. A well-designed user interface will ensure
that users can interact with the system without unnecessary complexity.


**Scalability** is another important aspect. The system must be designed to accommodate future
expansion, allowing the integration of additional devices and functionalities as required. It should
be flexible enough to adapt to different user needs and environments, making it suitable for a wide
range of applications, from home use to commercial settings.

Finally, **energy efficiency** is essential for the long-term usability of the system. The smart rings
and other hardware components must be energy-efficient to ensure long battery life and continuous
operation. The system should optimize power consumption, reducing the need for frequent
recharging or battery replacement, thereby making it convenient for the user and ensuring the
system's reliability over time.

### 4.2 Software Model: Agile Methodology

#### 4.2.1 Introduction to Agile Methodology

Agile methodology is a dynamic, iterative, and incremental approach to software development that
emphasizes flexibility, collaboration and continuous improvement. It enables teams to adapt to
changing requirements efficiently while delivering functional components in short cycles called
sprints.

#### 4.2.2 Features of Agile Methodology

1. **Iterative Development:** Agile divides the project into manageable iterations, ensuring
    incremental delivery of functional components.
**2. Flexibility:** The methodology accommodates changes to project requirements at any stage
    of development.
**3. Collaboration:** Agile promotes continuous collaboration among team members,
    stakeholders, and users.
**4. Focus on Deliverables:** Each sprint ends with a deliverable, enabling real-time feedback
    and early identification of issues.
**5. User-Centric Approach:** Regular user feedback ensures the product aligns closely with
    user expectations and needs.

#### 4.2.3 Suitability of Agile to The Leap Project

The Agile methodology is ideal for developing the Leap project due to the following reasons:

1. **Complexity Management:** Combining gesture recognition, facial recognition, and chatbot
    systems requires iterative development and integration, which Agile supports effectively.
**2. Adaptability to Changing Requirements:** Agile accommodates changes in functionality,
    such as adding features like OCR integration or enhancing personalization based on
    feedback.
**3. User-Centric Focus:** Regular testing and feedback during sprints ensure the final product
    meets user needs for accessibility, security, and usability.


**4. Integration Testing:** Agile's continuous integration approach ensures smooth
    communication between components like the smart ring, chatbot, and IoT devices.

#### 4.2.4 Phases of Agile Methodology for The Leap Project

**1. Concept and Requirement Gathering:**
    o Collaborate with stakeholders to define high-level objectives, such as integrating
       gesture recognition, face recognition and real-time chatbot interaction.
    o Identify critical requirements, including modularity, scalability, and accessibility.
**2. Sprint Planning:**
    o Break down the project into manageable sprints.
    o Define tasks, such as developing the gesture recognition system or chatbot
       interaction flow.
**3. Design and Prototyping:**
    o Create prototypes for components like the smart ring gesture recognition or chatbot
       interface.
    o Review prototypes with stakeholders for early feedback.
**4. Development and Integration:**
    o Develop individual components (gesture recognition, chatbot and facial
       recognition) incrementally during sprints.
    o Integrate components gradually and test for seamless functionality.
**5. Testing:**
    o Conduct unit testing for individual modules and integration testing for combined
       functionality.
    o Perform user acceptance testing to validate the system in real-world scenarios.
**6. Delivery and Deployment:**
    o Deliver functional components at the end of each sprint.
    o Deploy a fully integrated and tested system after completing all sprints.
**7. Feedback and Iteration:**
    o Gather feedback after each sprint to refine the system.
    o Address issues, enhance features, and optimize performance in subsequent
       iterations.


```
Figure 4.2.4: Agile Phases
```
#### 4.2.5 Methodology

The Leap project employs a modular design, combining gesture recognition, facial recognition,
and chatbot technologies into a unified smart home system. The methodology involves:

**1. Data Collection:**
    o Gathering gesture data from participants and training datasets for facial recognition
       and chatbot systems.
**2. Preprocessing:**
    o Applying techniques like normalization, filtering, and augmentation to enhance
       data quality.
**3. Model Development:**
    o Implementing RCE NN (Restricted Coulomb Energy Neural network) for gesture
       recognition.
    o Using Siamese Networks for facial recognition.
    o Leveraging Hugging Face Transformers for chatbot responses.
**4. Integration:**
    o Connecting all components using Firebase for real-time data storage and
       synchronization.
**5. Testing and Feedback:**
    o Conducting iterative testing and refining based on user feedback to ensure a user-
       friendly, secure, and efficient system.


### 4.3 Website

**4.3.1 Introduction**

There are many things to consider when developing a website, from functionality and appearance
to navigation and coding integrity, a lot goes into creating an eye-catching, user-friendly website.
Determining a database to store in data and data types, a frontend that will loosely mirror the
wireframe/prototype and building the backend to provide HTTP endpoints for the frontend and
using also Firebase, authenticate users, authorize, and serve the front end. The purpose of Firebase
is to make web application development easier and faster than coding a web app from scratch.

In our website we have three roles:

```
Admin User Visitor
Manage users Manage users Manage users
Manage issues Manage issues Manage issues
Manage orders Manage orders Manage orders
Manage, Create items Create, Manage items Manage, Create items
Manage, Create
inventory Reorder parts
```
```
Manage, Create
inventory Reorder parts
```
```
Manage, Create
inventory Reorder parts
Manage profile Manage profile Manage profile
Add issue Add issue Add issue
Place an order Place an order Place an order
Control smart devices Control smart devices Control components
Can contact Leap Support Can contact Leap Support Can contact Leap Support
```
**4.3.2 Front-End Development**

The web life cycle will be presented in this part from beginning to end. In this part, specific

parts of the web app implementation will be shown and discussed.

**4.3.2.1 Tools**

This project uses the three foundational technologies of the web: **HTML** , **CSS** , and **JavaScript**.
Below is a brief overview of each.

HTML(HyperText Markup Language) is the standard markup language used to create the
structure and content of web pages. It defines elements such as headings, paragraphs, links,
images, forms, and more.

CSS(Cascading Style Sheets) is used to control the **presentation and layout** of HTML content.
It allows you to apply styles such as colors, fonts, spacing, and positioning.

JavaScript(JS) is a high-level programming language used to add **interactivity and dynamic
behavior** to web pages. It can manipulate the DOM, handle events, and interact with servers.

**4.3.2.2 Admin Side**


Admin Can login to the Website when the owner add admin email when he was just a user. And
he can login as an admin.

**4.3.2.2.1 Admin login**

Figure 4.3.2.2.1 Admin login

**4.3.2.2.2 Admin |Users**

Once Admin login the Users Page will show up. In this page admin can read and manage
users(update, delete).

Figure 4.3.2.2.2 Admin |Users

**4.3.2.2.2 Admin |Orders**

In order page admin can update the status of the orders that users ordered and also filter orders
based on status(pending, completed and canceled).


Figure 4.3.2.2.2 Admin |Orders

**4.3.2.2.3 Admin |Issues**

In issues page admin can handle the users issues and give each issue priority and also filter issues
based on status(open, pending and closed).

Figure 4.3.2.2.3 Admin |Issues

**4.3.2.2.4 Admin |Items**

**In item page admin can add new item(ring, switch, etc..) that will show in the users part of
the website.**


```
Figure 4.3.2.2.4 Admin |Items
```
**4.3.2.2.5 Admin |Inventory**

**In inventory page admin can add new component(ESP32, PCB, etc..) and can reorder this
parts if it is out of stock.**

```
Figure 4.3.2.2.5 Admin |Inventory
```
**4.3.2.2.6 Admin |Settings**

In the setting page admin can update his profile by change profile photo or change password.


Figure 4.3.2.2.6 Admin |Settings

**4.3.2.3 User Side**

In user side we will focus on how user login , signup and verification of his email and phone

number using WhatsApp OTP.

**4.3.2.3.1 Landing Page**

Landing page for user how will visit us, show the signup, login buttons for authentication etc...

```
Figure 4.3.2.3.1 Landing Page
```

**4.3.2.3.2 Signup Page, email and phone number verification**

User signup and fill an input fields then Email and phone verification will show up and users can
verify their email and phone number.

```
Figure 4.3.2.3.2 Signup Page, email and phone number verification
```
How OTP delivered by WhatsApp :

**4.3.2.3.3 Login**

Once the user Signup to the website he can usually login as a user.


```
Figure 4.3.2.3.3 Login
```
**4.3.2.3.4 Shopping Page**

User can buy an a product by add them to the cart in the shopping cart then click the "Chek Out"

Button to buy the product

Figure 4.3.2.3.4 Shopping Page

**4.3.2.3.5 Order Details**

In product details page show the information of specific product and details.


Figure 4.3.2.3.5 Order Details

**4.3.2.3.6 Chek Out Page**

User continue to fill the input fields( address, city, etc..) and once the user click on the "place
order" button, the order will send to the admin orders page.

Figure 4.3.2.3.6 Chek Out Page


And Order Placed Successfully.

**4.3.2.3.7 Create issues Page**

User can create an issues that will delivered to the admin for what he needs.

```
Figure 4.3.2.3.7 Create issues Page
```

**4.3.2.3.8 Livingroom Page**

Once admin select order completed the user will be able to visit the Home components.

Figure 4.3.2.3.8 Livingroom Page

**4.3.2.3.9 Profile Page**

In the profile user can reset or change password.

Figure 4.3.2.3.9 Profile Page

**4.3.3 Backend Development**

This section details the server-side architecture, technologies, and functionalities that power the Leap smart home system. The backend is responsible for handling user authentication, managing data, processing business logic, and ensuring seamless communication between the user interfaces (web and mobile) and the IoT devices.

**4.3.3.1 Tools and Technologies**

The backend is built using a modern JavaScript stack, chosen for its performance, scalability, and rich ecosystem. The primary tools include:

- **Node.js**: A runtime environment for executing JavaScript on the server-side.
- **Express.js**: A minimal and flexible Node.js web application framework used to build our API endpoints.
- **Firebase**: A comprehensive platform from Google that provides several crucial backend services.

**4.3.3.2 Backend Design Pattern**

The Leap system's backend is initially designed using a monolithic architecture. This approach centralizes the codebase, which simplifies development, testing, and deployment in the early stages of the project. All core functionalities—including user management, device control, and API endpoints—are managed within a single, unified application. This pattern was chosen for its straightforwardness, allowing for rapid development and iteration, which aligns with our Agile methodology.

As the system grows in complexity and user load, we plan to evolve towards a microservices architecture to enhance scalability and maintainability, as mentioned in our future work.

**4.3.3.3 Authentication and Authorization**

Secure access is managed through a multi-layered authentication and authorization process:

- **User Authentication**: We use Firebase Authentication to manage user sign-up and login processes. It provides a secure and easy-to-implement solution for handling user credentials, including email/password authentication.
- **Phone Verification**: To enhance security and validate user identity, we have implemented a phone number verification step during signup using a custom WhatsApp OTP (One-Time Password) service. This service is an open-source project available at https://github.com/Abd-El-Rahman-Mohamed/whatsapp-otp and is deployed on Railway at https://whatsapp-otp-production.up.railway.app. When a user signs up, an OTP is sent to their WhatsApp number, which they must enter to complete registration.
- **Email Verification**: To enhance security and validate user identity, we have implemented an email verification step during signup using Firebase Authentication. When a user signs up, a verification email is automatically sent to their registered email address. The user must click the verification link in the email to complete their registration. This ensures that only users with valid email addresses can access the system. The verification status is tracked in Firebase, and users cannot access certain features until their email is verified. This is followed by phone verification using WhatsApp OTP for additional security.
- **Password Management**: The system implements comprehensive password management features to ensure account security:

  - **Change Password**: Authenticated users can change their password through their profile settings:
    - Requires current password verification
    - Updates password in Firebase Authentication
    - Maintains session security during password change

  - **Reset Password**: Users who have forgotten their password can request a reset:
    - Accessible from the login page
    - Requires email verification
    - Sends password reset link to user's registered email
    - Link expires after 24 hours for security
    - Allows setting a new password without knowing the old one
    - Requires email verification before allowing password reset
    - Sends confirmation email after successful reset

  - **Security Features**:
    - Rate limiting on password attempts
    - Secure password storage using Firebase Authentication
    - Automatic session invalidation on password change
- **Profile Image Management**: The system provides a user-friendly interface for managing profile pictures:

  - **Image Upload**: Users can update their profile picture through their profile settings:
    - Supports common image formats (JPG, PNG, JPEG)
    - Drag-and-drop interface for easy upload
    - Using Imgbb image hosting platform for Image hosting

  - **Image Processing**:
    - Automatic image resizing to standard dimensions
    - Maintains aspect ratio
    - Stores images urls in Firebase Firestore database

  - **Storage and Retrieval**:
    - Secure storage in Firebase Storage
    - Image hosting platform delivery for fast image loading

  - **User Experience**:
    - Real-time preview of selected image
    - Immediate update across all user interfaces
    - Fallback to default avatar if upload fails
    - Error handling for failed uploads
- **Role-Based Access Control**: The system distinguishes between two main roles: 'User' and 'Admin'. By default, all new sign-ups are assigned the 'User' role. To elevate a user's privileges to 'Admin', the user must contact the system owner directly. This manual process ensures a high level of security for administrative functions.
 **Order-Based Access Control**: To ensure that only verified customers can access certain features, the system implements an order-based access control mechanism. Specifically, access to the Living Room, Bedroom, and Kitchen control pages is restricted to users who have completed at least one order. This is implemented through a dual-check system:
  - The system verifies the user's authentication status
  - It then checks both the main orders collection and the user's subcollection for completed orders
  - Access is granted only if the user has at least one completed order
  - Users without completed orders are redirected to the Products to make an order
  This ensures that only legitimate customers who have purchased the system can access the smart home control features.

**4.3.3.4 Users Management System**

The backend implements a secure user management system that is exclusively accessible to administrators:

- **User Management**: Admins can manage user accounts through a dedicated interface, with each user's data stored in Firebase with the following structure:
  - User ID
  - User profile image
  - Email (verified)
  - Phone number (verified/not verified)
  - Username
  - Address

- **Admin Controls**: The system provides comprehensive administrative capabilities:
  - View all registered users and their details
  - Delete user accounts
  - Monitor user order history
  - Manage user order status
  - Access user issues

- **Security Features**:
  - Role-based access control ensures only admins can access the management interface

**4.3.3.5 Order Management System**

The backend implements a comprehensive order management system that handles the entire order lifecycle:

- **Order Creation**: Users can place orders through the shopping interface, with each order stored in Firebase with the following structure:
  - Order ID and timestamp
  - User ID and shipping information
  - Product details and quantities
  - Total price and payment status
  - Current status (pending, completed, canceled)
    pending is the default
  - Admin notes and tracking information

- **Order Processing**: The system provides different views for users and admins:
  - Users can view their order history and current order status
  - Admins can view all orders, update their status, and add tracking information
  - Admins can filter orders based on their status, and add tracking information
  - Updates ensure both users and admins are viewing the status changes
  - Order completion triggers access to smart home control features

**4.3.3.6 Issue Management System**

The backend implements a comprehensive issue management system that allows users to create and track support requests:

- **Issue Creation**: Users can create support tickets through a dedicated interface, providing details about their concerns or requirements. Each issue is stored in Firebase with the following structure:
  - Issue title and description
  - User ID and contact information
  - Creation timestamp
  - Current status (open, pending, closed)
    pending is the default
  - Priority level (set by admin)

- **Issue Processing**: The system provides different views for users and admins:
  - Users can create new issues and view their own issue history
  - Admins can view all issues, update their status, set priority levels, and add resolution notes
  - Updates ensure both users and admins are viewing the status changes
  - Admins can filter issues based on their priority, and status

**4.3.3.7 Items Management System**

The backend implements a secure items management system that is exclusively accessible to administrators:

- **Product Management**: Admins can manage the product catalog through a dedicated interface, with each product stored in Firebase with the following structure:
  - Product ID and name
  - Description and specifications
  - Price and availability status
  - Product images is Hosted at Imgbb for remote access instead of local hosting

- **Admin-Only Features**: The system provides comprehensive management capabilities exclusively for administrators:
  - Create new products with detailed specifications
  - Update existing product information and prices
  - Setting reorders
  - Upload and manage product images

- **Security Measures**:
  - Admin-only access enforced through Firebase Authentication
  - Input validation to prevent data corruption
  
**4.3.3.8 Inventory Management System**

The backend implements a secure inventory management system exclusively for administrators to manage IoT component parts:

- **Inventory Control**: Admins can manage the parts inventory through a dedicated interface, with each item stored in Firebase with the following structure:
  - Part ID and name
  - Current stock quantity
  - Last restock date
  - Cost per unit

- **Admin-Only Features**:
  - Add new parts to inventory
  - Update stock quantities
  - Track part usage in IoT components
  - View inventory and reorder history

- **Firebase Integration**: Inventory is stored in a secure Firestore collection with strict access control:
  - Only admin users can access and modify inventory data
  - Reorders monitoring
  - Audit trail of all inventory changes

- **Security Measures**:
  - Role-based access control ensures only admins can access inventory
  - All inventory changes are logged with admin ID and timestamp
  - Regular inventory audits can be performed

**4.3.3.9 Automated Email Invoicing**

After a user successfully places an order through the website, the backend automatically sends a detailed invoice to the user's registered email address. This functionality is implemented using EmailJS, a service that allows sending emails directly from the client-side or server-side code without needing a full backend server for email management.

**4.3.3.10 Real-Time Database and IoT Integration**

The core of our smart home control functionality relies on real-time data synchronization between the user interfaces and the connected IoT devices.

- **Firebase Real-Time Database**: We utilize Firebase's Real-Time Database, a NoSQL cloud database, to store and sync data instantly. This is crucial for real-time control of smart devices.
- **Living Room Lighting Control**: For example, the lighting in the 'Livingroom' is controlled by a specific entry in the database. The frontend application updates a value in the database, and the corresponding smart light (connected via an ESP module) listens for changes to that value.
  - Setting the value to 1 turns the light on.
  - Setting the value to 0 turns the light off. This ensures that commands from the web or mobile app are executed with minimal latency.

**4.3.3.11 Backend Testing**

To ensure the reliability and robustness of our backend, we have planned a comprehensive testing strategy that will be implemented in future iterations:

- **Unit Testing**: We plan to write unit tests for individual functions and modules (e.g., authentication logic, API route handlers) to verify their correctness in isolation.
- **Integration Testing**: We plan to conduct integration tests to ensure that different parts of the backend (like the API, database, and external services) work together seamlessly. This will include testing the end-to-end flow of user requests, from the API endpoint to the database and back.

*Note: While this testing strategy is planned, it has not been fully implemented in the current version. The only testing currently in place is manual testing for the phone verification system.*

### 4.4 Mobile Application

#### 4.4.1 Platform Selection

**_4. 4 .1.1 Native vs Hybrid Apps_**

The mobile application for the Leap project will be developed using Flutter, a cross-platform
framework by Google. Flutter was chosen over native development due to its ability to create high-
performance applications for both iOS and Android platforms using a single codebase. This
approach significantly reduces development time and costs while ensuring consistent functionality
and design across devices. Additionally, Flutter's rich widget library and hot-reload feature
streamline the development process, enabling rapid prototyping and iterative improvements.

**_4. 4 .1.2 Cross-Platform Compatibility_**

The decision to use a hybrid app framework (Flutter) over native development was driven by the
need for cross-platform compatibility and efficient resource utilization. Native apps, while
offering superior performance and access to platform-specific features, require separate codebases
for iOS and Android, increasing development complexity and maintenance efforts. In contrast,
Flutter provides near-native performance and access to device APIs while maintaining a single
codebase, making it ideal for the Leap project's requirements.

#### 4.4.2 App Development

The development of the mobile application focused on delivering an intuitive and user-friendly
interface while integrating advanced functionalities. Flutter's widget-based architecture facilitated
the creation of a responsive and visually appealing user interface (UI). The app's design adheres
to modern UI/UX principles, ensuring ease of navigation and accessibility for all users.

**_4. 4 .2.1 User Interface and Experience_**

The app's UI was designed to prioritize simplicity and usability, with a clean layout and intuitive
navigation. Key features such as real-time alerts, device controls, and health monitoring are
prominently displayed, ensuring users can access critical functionalities with minimal effort.
Flutter's customizable widgets enabled the creation of a cohesive and visually consistent design
across all screens, enhancing the overall user experience.


```
Figure 4.4.2.1: mobile UI
```
_4.3.2.2 App Features and Functionalities_

The mobile application integrates several core features, including real-time alerts from facial
recognition, chatbot-based voice and text commands, home control and monitoring, and health
metrics display. These functionalities are seamlessly interconnected, providing users with a unified
platform for managing their smart home ecosystem. Flutter's robust ecosystem of plugins and
packages facilitated the integration of third-party services such as Firebase for real-time data
synchronization and cloud storage.


# Chapter 5

# IoT Development

This Chapter presents the hardware and software integration of the Smart Ring system,
covering the gesture recognition unit, circuit design, PCB layout, charging module, and smart
home actuators. It details the use of the ESP8266- 01 s and MPU6050 for real-time motion tracking
and wireless data transmission. A custom PCB ensures compactness, while the TP4056-based
charging unit provides safe recharging. Additionally, smart actuators like switches and door locks
are integrated using the same architecture, allowing remote and manual control via Firebase. The
section emphasizes modular design, power efficiency, and real-time connectivity across all
subsystems.

## 5.1 Smart Ring

```
Figure 5.1: Ring circuit
```
**5. 1 .1 Use Case**

The circuit and wiring system forms the physical backbone of the Smart Ring, enabling real-time
gesture recognition and wireless communication with the smart home infrastructure. This unit
ensures seamless integration between the microcontroller, motion sensor, and power source while
maintaining low energy consumption and a compact footprint. The primary use case is to support
continuous motion tracking and trigger commands wirelessly, thereby allowing the user to
control smart devices through simple hand gestures without physical interaction with switches or
screens.


**5. 1 .2 Hardware Components and Justification**

The hardware of the Smart Ring consists of four main components:the ESP8266- 01 s module, the
MPU6050 motion sensor, a 3.7V Li-Po battery, and a DPDT slide switch. The ESP8266- 01 s was
selected for its compact size, integrated Wi-Fi capability, and low power consumption, making it
ideal for wearable devices with limited space. The MPU6050 combines a 3-axis gyroscope and
3 - axis accelerometer, providing precise motion sensing required for gesture recognition. The Li-
Po battery supplies lightweight and rechargeable power suitable for extended operation in
wearable applications. A DPDT (Double Pole Double Throw) switch is included to control the
power routing, allowing the user to manually switch between active and charging states,
enhancing safety and usability. Additionally, a JST 2-pin connector is incorporated as a charging
interface, providing a compact and secure connection for power input during recharging.

**5. 1 .3 Software**

The software component of the Smart Ring is implemented using the Arduino environment with
the C++ programming language, and it is deployed on the ESP8266- 01 s Wi-Fi module. The
firmware integrates real-time sensor data acquisition, wireless communication via WebSocket,
and IP auto-registration via HTTP to a local Flask server.

Upon startup, the ESP8266 establishes a connection to a predefined Wi-Fi network and
automatically sends its local IP address to the Flask server using an HTTP POST request. This
enables dynamic device discovery and registration without manual configuration, simplifying
integration with the backend infrastructure.

For motion tracking, the MPU6050 sensor is interfaced over the I2C bus using GPIO0 (SCL) and
GPIO2 (SDA) of the ESP-01s. The sensor is configured with appropriate ranges for
accelerometer and gyroscope readings to capture precise motion patterns. Sensor data is
continuously polled and structured as a JSON object containing six features: three-axis
acceleration and three-axis angular velocity.

The ESP8266 hosts a local HTTP web server on port 80 that serves a live HTML dashboard,
displaying the latest 50 sensor readings in real-time via a WebSocket connection on port 81. This
WebSocket stream broadcasts the JSON-encoded sensor data to any connected web client,
enabling real-time visualization without the need for refreshing the page.

The software is optimized to run efficiently on the limited resources of the ESP-01s, using
lightweight libraries such as ESP8266WiFi, ESP8266WebServer, WebSocketsServer,
HTTPClient, and ArduinoJson. This modular software architecture ensures responsive
performance, low latency, and seamless interaction with both the user interface and the backend
services.


**5. 1 .4 PCB Design and Layout**

```
Figure 5. 2 : Ring PCB
```
To support compact and reliable deployment, a custom-designed Printed Circuit Board (PCB)
was developed. The layout integrates all components—ESP8266-01, MPU6050, Li-Po battery
connector, DPDT switch, and JST charging port—within a minimal footprint suitable for
wearable applications. The PCB includes designated headers for the ESP8266-01's eight pins
(RX, TX, GPIO0, GPIO2, GND, 3V3, CH_PD, RESET) and clear routing for I2C
communication lines (SCL and SDA) to the MPU6050 sensor.

The power path is managed through the DPDT switch, which directs the battery's positive and
negative terminals either to the system for operation or to the JST connector for charging. This
ensures safe and controlled charging behavior. The JST 2-pin connector serves as the primary
charging port and is wired directly to the switch, allowing external chargers to power the battery
without directly energizing the system.

The PCB's trace design is optimized for current flow and signal integrity, with thicker power
lines for battery current and well-isolated signal traces for stable communication. Mounting
holes are included to facilitate integration into wearable enclosures. Overall, the PCB design
reduces wiring complexity, enhances mechanical reliability, and ensures efficient use of space,
contributing to a sleek and robust Smart Ring implementation.


**5.2 Charging Unit**

```
Figure 5. 3 : Ring Charger
```
**5.2.1 Use Case**

The charging unit serves as the external power management system for safely recharging the
Smart Ring's internal Li-Po battery. It is designed to connect via a JST 2.54 mm 2-pin connector,
allowing easy and secure connection to the Smart Ring. The unit provides a safe, compact, and
reusable method of charging using a standard 5V USB input and is based on the TP4056
charging module. This enables the ring to be charged externally without the need to remove the
battery, ensuring user convenience and safe energy transfer during recharging cycles.

**5.2.2 Hardware Components and Justification**

The charging unit is built around the TP4056 Lithium Battery Charging Module, which
integrates a linear charger circuit specifically designed for single-cell Li-Ion batteries. The
TP4056 was chosen due to its high reliability, integrated overvoltage protection, current
regulation, and compact footprint. The module includes clear terminal pads for input (IN+ and
IN-), battery connection (B+ and B−), and output (OUT+ and OUT−).

A JST PH 2.54 mm 2-pin female connector is used as the interface for connecting to the Smart
Ring. Pin 1 of the JST connector is connected to the B− terminal of the TP4056, while Pin 2 is
connected to the B+ terminal. This arrangement allows seamless charging through the same
connector used for battery connection in the ring, reducing complexity and enhancing
mechanical robustness. The use of USB Micro-B for input power makes the module widely
compatible with standard USB chargers.


### 5.3 Smart Switch

```
Figure 5. 4 : Smart Switch circuit
```
#### 5.3.1 Use Case

The Smart Switch is designed to provide users with flexible control over AC-powered
appliances, such as lighting, through multiple interfaces. These include a mobile application,
website dashboard, Smart Ring, and manual pushbutton. This multi-channel control ensures ease
of use and accessibility across various user scenarios and preferences.

#### 5.3.2 Hardware Components and Justification

The system includes an ESP-01S relay module, a pushbutton, a 3.7V 18650 Li-ion battery, an
AC-powered lamp, and an AC plug. The ESP-01S manages connectivity and switching logic.
The relay module safely controls the flow of current to the lamp. The pushbutton connected to
GPIO2 provides local manual override. The use of a Li-ion battery ensures portability and low-
power operation, while the AC plug supplies power to the lamp through the relay.

#### 5.3.3 Software

The firmware for the Smart Switch is developed using the C++ programming language within
the Arduino IDE, ensuring efficient and modular code development. For real-time data exchange
and remote control, the Firebase ESP Client Library is utilized. This integration enables seamless
communication with Firebase, allowing users to monitor and control connected appliances
remotely through the mobile application or website dashboard.

**5.4 Smart Door Lock**


```
Figure 5. 5 : Smart Door Lock circuit
```
### 5.4.1 Use Case Page | v

The smart door lock system is designed to provide secure access control using both manual and
wireless inputs. Users can unlock doors via remote commands from connected devices or
through a local pushbutton. The system integrates a relay-controlled solenoid lock powered by a
12V adapter, with logic managed by an ESP-01S module. This dual-interface setup ensures
flexibility, enabling remote or manual control depending on user needs or network availability.

### 5.4.2 Hardware Components

The system consists of an ESP-01S relay module, a 12V solenoid lock, a pushbutton, a 12V DC
adapter, and a 3.7V 18650 Li-ion battery. The ESP-01S handles communication and logic
control. The relay switches the high-power solenoid lock, while the pushbutton offers manual
override. A compact PCB may be used to simplify wiring and integration.

### 5.4.3 Software Setup

The firmware for the smart door lock is developed using the C++ programming language within
the Arduino IDE, ensuring efficient and modular code development. For real-time data exchange
and remote control, the Firebase ESP Client Library is utilized. This integration enables seamless
communication with Firebase, allowing users to monitor and control door access remotely
through the mobile application or website dashboard.


**_Chapter 6_**

**_Experimental Analysis_**

This chapter presents a detailed analysis of the experimental results obtained during the
development and testing phases of the Leap project. It provides insights into the challenges
encountered during system evaluation, focusing on the risks identified and the strategies employed
to mitigate them. The primary goal of this chapter is to ensure that the Leap system can operate
effectively across diverse environments, maintain robust security, and provide a seamless user
experience.

**6 .1 Risk Analysis**

The Leap project involves several technical, operational, and security risks that could hinder the
overall performance, user experience, and adoption. A thorough risk analysis is critical to
identifying potential issues and formulating strategies to address them. In this section, we examine
key risks related to system performance, data privacy, and user adoption, and propose strategies to
mitigate these risks in subsequent phases of development.

**6 .1.1 Technical Risks**

**System Reliability in Diverse Environments**

One significant risk to the system's performance is its ability to function accurately in various
environments, especially those with fluctuating lighting, background noise, or different user
movement patterns. The system's accuracy may degrade in such conditions, leading to poor user
experiences. To address this, adaptive machine learning models will be implemented, enabling the
system to adjust dynamically to environmental changes. Real-world testing will be conducted in
diverse settings to refine the system's performance, ensuring that it can handle different lighting
conditions and noise levels. Additionally, the integration of environmental sensors, such as light
sensors and microphones, will provide the system with real-time context to adapt its behavior
accordingly.

**Battery Life and Power Consumption**

Another challenge arises from the limited battery life of the wearable components, particularly the
smart ring, which may require frequent recharging. To mitigate this risk, the battery management
system (BMS) will be further optimized to reduce power consumption during idle and active states.
Moreover, energy-efficient hardware components such as low-power inertial measurement units
(IMUs) and Bluetooth Low Energy (BLE) will be incorporated to extend battery life. Power-saving
modes will also be implemented to reduce energy usage during periods of inactivity, contributing
to longer operational times between charges.


**Data Latency**

Delays in processing and transmitting data could result in significant user experience issues,
particularly in applications that require real-time interaction. To reduce latency, local processing
capabilities on the smart band will be enhanced, minimizing dependence on cloud-based systems
and thus reducing transmission delays. Additionally, edge computing techniques will be utilized
to process data closer to the source, enabling faster decision-making. Communication protocols,
such as ESP-NOW and Bluetooth, will be optimized to ensure rapid data transmission between
devices, further reducing latency and improving system responsiveness.

**Speech Recognition Accuracy**

Variations in accents, background noise, and audio quality may reduce speech-to-text accuracy,
impacting the user experience. To mitigate this: Fine-tune models for diverse accents and dialects,
implement noise reduction techniques to enhance audio clarity, use adaptive algorithms to learn
user-specific speech patterns and conduct real-world testing in varied acoustic environments.

**6 .1.2 Security Risks**

**Data Privacy**

Sensitive user data, including facial recognition embeddings and gesture patterns, is susceptible to
unauthorized access, posing significant privacy risks. To safeguard this data, end-to-end encryption
will be implemented for all data transmission and storage. This encryption will protect sensitive
information from being intercepted or accessed by unauthorized parties. Furthermore, biometric
data will be securely stored using secure enclaves or hardware-based security modules, reducing
the likelihood of data exposure. Regular updates to the system's security protocols will be essential
to address emerging threats and vulnerabilities, ensuring that the system remains secure over time.

**Unauthorized Access**

Another security concern is the potential for unauthorized users to gain access to the smart home
system. To counter this risk, the facial recognition system will be enhanced with liveness detection,
which can detect spoofing attempts using photos or videos. In addition, multi-factor authentication
(MFA) will be implemented, combining facial recognition with other forms of authentication, such
as PIN codes or gesture-based systems, to provide an additional layer of security. An intrusion
detection system (IDS) will also be developed to monitor for unusual access patterns and alert
users to potential security breaches, ensuring that the system remains secure from unauthorized
access.

**6 .1.3 Usability and Adoption Risks**

**User Experience and Learning Curve**

A major risk to the system's success is the potential for users to find the technology difficult to use,
leading to low adoption rates. If the system's interface is unintuitive or complex, users may


abandon it before realizing its full potential. To address this, user-centered design workshops will
be conducted to gather feedback and refine the system's interface. Additionally, interactive
tutorials and onboarding processes will be developed to guide users in learning how to use the
system effectively. Adaptive user interfaces will also be implemented, personalizing the experience
based on individual preferences and behaviors to ensure a smooth interaction with the system.

**Resistance to Adoption**

Some users may resist adopting the Leap system, particularly if they perceive it as unnecessary or
overly complex. To overcome this resistance, the tangible benefits of the system, such as improved
accessibility, convenience, and security, will be emphasized through real-life use cases and
testimonials. Offering trial periods or demo versions will allow users to experience the system's
capabilities firsthand, helping them understand its value. Furthermore, comprehensive customer
support will be available to address any concerns and ensure a smooth transition to using the new
technology.

**Prompt Engineering Challenges**

Prompt engineering is critical to ensuring the relevance and accuracy of AI chatbot responses, as
the quality of input directly determines output performance. Challenges arise from ensuring
prompts provide sufficient context for understanding, offering clear and unambiguous instructions,
and defining response formats to meet user expectations. Poorly designed prompts can lead to
irrelevant, incomplete, or incoherent outputs, impacting the chatbot's reliability and user
satisfaction. Addressing these issues requires iterative prompt optimization, dynamic context
incorporation, and the use of structured templates tailored to domain-specific needs. By mitigating
these challenges, the chatbot can deliver precise, relevant, and well-structured responses,
enhancing user engagement and functionality.

**_Chapter 7_**

**_Conclusion and Future Work_**

This chapter provides a detailed conclusion to the Leap project, summarizing the progress
made during its initial phase, the challenges encountered, and the lessons learned. It also highlights
potential areas for future enhancements to improve the system's functionality, scalability, and user


experience. By structuring the chapter in this manner, it seeks to offer a comprehensive
understanding of the project's current impact and its possibilities for future advancements.

### 7 .1 Conclusion

The Leap project represents the completion of its first phase, focusing on laying the
groundwork for a modular and scalable smart home automation system. This phase has aimed to
address key aspects of the system, particularly gesture recognition and facial recognition, while
conceptualizing the integration of a conversational AI chatbot. Although the system has not been
fully implemented or integrated into web and mobile platforms yet, the progress made in this phase
has established a robust foundation for subsequent development.

The development of the facial recognition component has been a central focus of this phase. The
system's dataset preparation involved organizing anchor, positive, and negative samples to ensure
effective training of the Siamese Neural Network. The use of the Labelled Faces in the Wild (LFW)
dataset provided a robust foundation for the negative samples, while real-time image capture was
utilized for anchor and positive samples. A convolutional neural network (CNN) was employed to
extract facial features, and a Siamese network architecture was implemented to generate
embeddings for accurate comparisons. OpenCV was used for real-time face detection and
preprocessing, enabling the system to handle live video inputs effectively. These steps have
demonstrated the feasibility of the facial recognition component, even though the model has yet to
be fully trained and validated.

Gesture recognition development has also seen significant progress. The project has focused on
collecting a custom dataset using IMU sensors to capture hand and wrist movements.
Preprocessing steps, such as normalization, noise reduction, and segmentation, were applied to
prepare the data for model training. A preliminary framework for implementing machine learning
models, such as Radial Basis Function networks and Restricted Coulomb Energy classifiers, has
been established, but these models remain to be fully tested and evaluated.

The chatbot component, while not yet developed, has been conceptually planned as an integral
part of the system. Powered by conversational AI, it is intended to provide users with personalized
assistance and seamless interaction with smart home devices. Future phases will focus on
implementing and refining this component.

Although the integration of these components into a unified web and mobile platform has not yet
occurred, this remains a key objective for the next phase. The aim is to create an intuitive and
accessible interface that allows users to control and monitor their smart home devices seamlessly.

### 7 .2 Future Work

As the Leap project advances, several key areas of improvement and expansion will be
prioritized to enhance functionality, usability, and scalability. The **gesture recognition system** will


be expanded to include a broader library of gestures, enabling more complex and customizable
controls. Additionally, user-specific gesture learning will be implemented to improve
personalization and accuracy. For the **facial recognition system** , future improvements will focus
on handling varying lighting and crowded environments by integrating sensors like light detectors.
The system will support multi-user recognition and introduce liveness detection to prevent
spoofing using techniques such as blink detection and depth analysis.

The **chatbot component** will be enhanced with contextual understanding and personalization
features. By fine-tuning the model on larger and more diverse datasets, the chatbot will deliver
more coherent and relevant responses. Its seamless integration into web and mobile platforms will
ensure a unified user experience. New functionalities, such as **Daily Task Scheduling and
Reminders** and **Bill Analysis and Spending Reports** , will be developed to expand the system's
usability. The latter will utilize OCR technology to extract costs from bill photos, analyze monthly
expenses, and generate detailed spending reports with actionable recommendations.

On the **technical front** , the system will be designed for scalability and cross-platform
compatibility. A **microservices architecture** and load balancing proxies will be employed to
handle increased user demand efficiently. The development of a desktop application will further
ensure cross-platform compatibility. Integration with IoT devices, such as smart armbands and
rings, will be optimized using Firebase's real-time database, while lightweight machine learning
models will be deployed on edge devices to enhance real-time performance and energy efficiency.

Finally, **user experience and accessibility** will be improved through the integration of voice
control capabilities, haptic feedback, and voice-guided navigation. These features will ensure the
system remains inclusive and practical for a diverse range of users, while future enhancements,
such as additional IoT device integrations and advanced AI functionalities, will further solidify the
system's position as a versatile and user-centric solution.

**Backend Testing and Quality Assurance**
To ensure the reliability and robustness of the system, a comprehensive backend testing strategy will be implemented:

1. **Unit Testing Framework**
   - Implement automated unit tests for individual functions and modules
   - Focus on testing authentication logic, API route handlers, and database operations
   - Use testing frameworks like Jest or Mocha for JavaScript/Node.js components
   - Establish continuous integration to run tests automatically on code changes

2. **Integration Testing**
   - Develop end-to-end tests for complete user flows
   - Test interactions between different backend components (API, database, external services)
   - Implement automated API testing using tools like Postman or Supertest
   - Create test environments that mirror production settings

3. **Performance Testing**
   - Conduct load testing to ensure system stability under heavy usage
   - Implement stress testing to identify system breaking points
   - Monitor and optimize database query performance
   - Test real-time data synchronization with Firebase

4. **Security Testing**
   - Implement automated security testing for authentication and authorization
   - Conduct penetration testing for API endpoints
   - Test data encryption and secure storage practices
   - Regular security audits and vulnerability assessments

### 7 .3 Broader Implications

The Leap project's technologies have potential applications beyond smart home automation.
Gesture recognition could be employed in healthcare to control medical devices or assist patients
with mobility impairments. Facial recognition systems could enhance security and efficiency in
industrial settings by controlling access to sensitive areas. The chatbot component could serve as
a virtual teaching assistant in education, providing personalized learning experiences for students.
These broader implications highlight the versatility and potential impact of the technologies
developed in the Leap project.

### 7 .4 Final Thoughts

As smart home automation continues to evolve, the Leap project's first phase serves as a
foundation for future advancements in human-computer interaction and IoT technologies. The
insights gained and challenges addressed during this phase will guide subsequent development
efforts, paving the way for a more innovative, accessible, and secure smart home solution. By


addressing current limitations and leveraging emerging opportunities, the Leap project aims to
redefine smart home standards and enhance the quality of life for its users.

**8. 1 Online Resources and Tools**

**Gesture Recognition Tools**

- **TensorFlow** : https://www.tensorflow.org/

```
A powerful open-source library for machine learning and deep learning, used for building
and training gesture recognition models.
```
- **Keras** : https://keras.io/

```
A high-level neural networks API, used for simplifying the implementation of deep
learning models.
```
**Facial Recognition Tools**


- **OpenCV** : Used for real-time image capture, face preprocessing (cropping, resizing,
    normalization), and visualization.
- **YOLOv8** : Employed for fast and accurate face detection in both image and live video
    streams, enabling real-time response in dynamic environments.
- **InsightFace (VGGFace2-based model)** : Provides deep face embeddings using a
    pretrained model trained on the VGGFace2 dataset to ensure accurate identity
    representation.
- **ONNX Runtime** : Used to run YOLOv8 and InsightFace models efficiently across different
    platforms with hardware acceleration support.
- **NumPy / scikit-learn** : Utilized for calculating cosine similarity between facial
    embeddings to determine identity matches.

**Chatbot Development Tools**

- **Visual Studio Code**
- **Torch** : https://pytorch.org/

```
o PyTorch is a deep learning framework that supports the training and deployment of
neural networks. It is integral to running the Llama model, as it powers the
computations required by these pre-trained models, enabling your project to handle
large-scale, complex AI tasks efficiently.
```
- **Hugging Face Transformers** : https://huggingface.co/transformers/

```
o A library for state-of-the-art natural language processing (NLP), used for
developing the chatbot.
```
**Speech Recognition**

- **SpeechRecognition (sr):** https://pypi.org/project/SpeechRecognition/2.1.3/
    o This module is used to convert audio speech into text. It enables speech-to-text
       functionality in our project, which is valuable for applications like voice-controlled
       assistants, transcription services and enhancing the accessibility of our system for users
       with disabilities.

**8. 2 Datasets**

**_8.2.1 Gesture Recognition Dataset:_**

```
Custom Dataset : A custom dataset of 1,0000 hand gesture samples collected, used for
training, and evaluating the gesture recognition system.
```

**_8.2.2 Chatbot Training Data_**

```
Conversational Dataset : A dataset of conversational data, including user queries and
responses related to smart home control, used for training the chatbot.
```
### References

**8. 3 Academic Journals and books**

**1. M Kim, J Cho, S Lee, Y Jung. (2019).** _IMU Sensor-Based Hand Gesture Recognition for_
    _Human-Machine Interfaces._ [MPDI] [Google scholar]
**2. Mouser Electronics Blog (2023).** _IMU Basics._ [Mouser]_._
**3. Pololu Robotics and Electronics (2023).** _6 - DOF IMU Data Guide._ [Pololu]_._
**4. P Senin (2008).** _Dynamic Time Warping Algorithm Review._ [ResearchGate] [Google
    Scholar]_._
**5. Cao, Q., Shen, L., Xie, W., Parkhi, O. M., & Zisserman, A.** (2020). _VGGFace2: Deep_
    _face recognition across pose and age_. _IEEE Transactions on Pattern Analysis and_
    _Machine Intelligence, 44_ (5), 1827–1841. https://doi.org/10.1109/TPAMI.2020.2987138


**6. Jocher, G., Chaurasia, A., Stoken, A., & Hogan, A.** (2023). _YOLOv8: Ultralytics Real-_
    _Time Object Detection Model_ [GitHub Repository].
**7. Kumar, R., & Kumar, S.** (2023). A deep learning approach for facial recognition in
    smart homes. _Multimedia Tools and Applications, 82_ , 1–20.
    https://doi.org/10.1007/s11042- 023 - 15435 - 6
**8. Giaretta, A.** (2024). Privacy-preserving facial recognition for smart homes. _Virtual_
    _Reality, 28_ (1), 1–15. https://doi.org/10.1007/s10055- 023 - 00745 - 8
**9. Microsoft**. (2023). _ONNX Runtime: High-performance engine for cross-platform ML_
    _inference_. https://onnxruntime.ai
**10. Almeida, D., Shmarko, K., & Lomas, E.** (2021). Ethical and technical considerations in
    facial recognition systems. _AI and Ethics, 1_ (1), 1–12. https://doi.org/10.1007/s43681-
    021 - 00019 - 0
**11. Roy, M. K., Dwibedi, P., Singh, A., & Chakraborty, R. P.** (2023). MTCNN and
    FaceNet-based model for real-time attendance using facial biometrics. _Proceedings of the_
    _2023 International Conference on Computer Vision and Smart Systems_.
**12. Duque Domingo, J., Medina Aparicio, R., & Gonzalez Rodrigo, L. M.** (2021).
    Enhanced one-shot facial recognition with hybrid Siamese-CNN architecture. _Sensors,_
    _21_ (11), 7839. https://doi.org/10.3390/s21117839
**13. Li, C., Deng, W., & Du, J.** (2022). Liveness detection for face biometrics: Recent
    advances. _IEEE Transactions on Information Forensics and Security, 17_ , 1445–1461.
    https://doi.org/10.1109/TIFS.2022.3152083
**7. D. Sebastián Cabezas, R. Fonseca-Delgado. (2024).** _Integrating a LLaMa-based Chatbot_
    _with Augmented Retrieval Generation._ [ResearchGate].
**8. Sumit Kumar Dam, Choong Seon Hong. (2024).** _A Complete Survey on LLM-based AI_
    _Chatbots._ [ResearchGate].
**9. Stanford**. _Agile Development Methodology_ [Article].
**10. Hugging Face.** _chavinlo/alpaca-native Chatbot Model_ [Article]
**11. Indira KriGan (2023).** _Natural Language to SQL using an Open Source LLM_ [Medium].
**12. Muhammad Usama Khan (2024),** _How to build your Custom Chatbot with Llama 3.1_
    _using Ollama and OpenWebUI_ [Medium].


