# healthpredict ai

## get started

**predict, prevent, protect.**

Empowering individuals to manage chronic conditions with personalized health insights. Begin your journey toward better health today.

## key features

- **health predictions**  
  leverage machine learning to predict potential health risks—anticipate and act before disaster strikes. It’s proactive care, made simple.

- **real-time monitoring**  
  imagine a personal health assistant tracking your vitals, 24/7. Instant feedback on your daily metrics for continuous optimization.

- **data security**  
  rest assured, your health data is encrypted with military-grade security. Only authorized personnel (and, sadly, hackers) get a glimpse of your information.

---

## dashboard overview

| Feature               | Description                                                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------|
| **health score**      | dynamically generated based on recent metrics to give you an at-a-glance health status. *No data available yet. Start adding metrics.* |
| **risk level**        | real-time assessment of your current risk for various conditions based on tracked data. *No data available yet.*            |
| **next check-up**     | set reminders and manage your check-up schedule seamlessly. *Feature coming soon.*                                          |
| **health predictions**| your health metrics will directly impact your personalized health predictions. *Add metrics to begin.*                      |
| **recent metrics**    | quickly view the latest health metrics you've entered. *No metrics available yet. Start tracking today.*                   |
| **add new health metric** | easily track various health metrics including blood glucose, blood pressure, heart rate, and more. *Add your first metric now.* |

---

## tech stack

| Category              | Technologies / Tools                                    |
|-----------------------|---------------------------------------------------------|
| **Frontend**          | React.js, Next.js (14.2.18)                             |
| **Backend & Security**| Node.js, Express.js, reCAPTCHA, HSTS, Firebase          |
| **UI/UX Frameworks**  | Tailwind CSS, Radix UI, shadcn/ui, Lucide (icons)       |
| **Build Tools**       | Webpack, Vercel (deployment platform)                   |
| **Data Handling**     | WebSockets (for real-time updates), GraphQL (data querying) |
| **Performance**       | Priority Hints (performance optimization)               |

---

## future roadmap

- [ ] **reminders for check-ups and medications**  
  automated reminders to ensure timely follow-ups and medication adherence.
- [ ] **multi-device health data sync**  
  sync your health data across multiple devices seamlessly for a unified experience.
- [x] **advanced analytics dashboard**  
  visualize and analyze trends in your health metrics with advanced analytics and predictive graphs.
- [ ] **integration with wearable devices**  
  integrate with fitness trackers and smartwatches for seamless data collection.
- [ ] **AI-driven health insights**  
  receive tailored recommendations based on predictive models for a proactive health management strategy.
- [ ] **community features**  
  connect with peers for motivation, advice, and support in managing chronic conditions.
- [ ] **machine learning prediction backend**  
  enhance backend prediction algorithms using more advanced machine learning models to provide highly accurate health predictions.

---

## live demo

Explore the live version of the app here:  
[healthpredict ai](https://predict-ai-production.vercel.app/)

---

## 🐳 docker 

you can easily run **healthpredictAI** using docker. this is the simplest way to get started without worrying about environment setup.

### **pre-requisites:**

- [docker](https://www.docker.com/get-started) installed on your system.

### **pull the Docker Image:**

pull the pre-built docker image from gitHub container registry:

```bash
docker pull ghcr.io/moroii69/healthpredictai:latest
```

### Run the Docker Container:
Start a new container:

```bash
docker run -d -p 3000:3000 ghcr.io/moroii69/healthpredictai:latest
```
access the application at: http://localhost:3000

---

## contribute

this is a personal project. if you have suggestions or would like to contribute, feel free to open an issue or submit a pull request.
