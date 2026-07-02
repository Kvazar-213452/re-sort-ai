## About the Project

ReSort AI was inspired by a simple everyday problem — people often don’t know how to properly sort waste or recycle items correctly. Even small mistakes in waste disposal can lead to significant environmental impact over time. I wanted to make sustainability effortless by using AI to instantly guide users on what to do with any object they encounter.

## Inspiration

The idea came from observing how confusing recycling rules can be across different countries and even cities. A plastic item in one place might be recyclable, while in another it might not be. I wanted to build something universal — an AI-powered assistant that removes this uncertainty and makes eco-friendly decisions instant and intuitive.

## What I learned

During this project, I learned how powerful computer vision models can be when combined with real-world practical use cases. I also improved my skills in:
- Integrating AI APIs for image recognition and classification  
- Designing user-friendly interfaces for fast interaction  
- Structuring a full-stack web application under time constraints  

## How I built it

ReSort AI is built as a web application using a modern full-stack approach:

- Frontend: React / Next.js with a clean, minimal UI
- Backend: Node.js / FastAPI for handling AI requests
- AI Layer: Vision model (e.g., OpenAI / Gemini) for object detection and classification
- Database: Stores user scan history and eco statistics
- Deployment: Hosted as a web app accessible from any device

The user simply uploads an image or uses their camera, and the system returns:
- Object identification
- Correct waste category
- Recycling instructions
- Environmental impact information

## Challenges I faced

One of the biggest challenges was ensuring accurate classification of real-world objects under different lighting and angles. Another challenge was simplifying complex recycling rules into clear, user-friendly responses.

I also had to balance speed and accuracy — making sure the AI response feels instant while still being reliable.

## Final Thoughts

ReSort AI is more than just a project — it is a step toward making sustainability easier through technology. My goal is to encourage better environmental habits by removing confusion and making eco-friendly decisions automatic.