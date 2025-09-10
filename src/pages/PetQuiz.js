import { useState } from "react";

const PetQuiz = ({ onQuizComplete }) => {
  // State to store the user's answers
  const [answers, setAnswers] = useState({
    activity: "",
    size: "",
    allergy: "",
    location: "",
  });

  // State to manage the current step of the quiz
  const [currentStep, setCurrentStep] = useState(0);

  // State for loading feedback
  const [isLoading, setIsLoading] = useState(false);

  // Array of quiz questions
  const questions = [
    {
      id: "activity",
      question: "What's Your Activity Level?",
      type: "select",
      options: [
        { value: "high", label: "High", icon: "🏃" },
        { value: "medium", label: "Medium", icon: "🚶" },
        { value: "low", label: "Low", icon: "🛋️" },
      ],
      required: true,
    },
    {
      id: "size",
      question: "What's Your Preferred Pet Size?",
      type: "select",
      options: [
        { value: "small", label: "Small", icon: "🐾" },
        { value: "medium", label: "Medium", icon: "🐕" },
        { value: "large", label: "Large", icon: "🐎" }, // Maybe not a horse, but a big dog!
      ],
      required: true,
    },
    {
      id: "allergy",
      question: "Do you have pet allergies?",
      type: "select",
      options: [
        { value: "yes", label: "Yes", icon: "🤧" },
        { value: "no", label: "No", icon: "👍" },
      ],
      required: true,
    },
    {
      id: "location",
      question: "Where are you located? (City, State/Region)",
      type: "input",
      inputType: "text",
      required: true,
    },
  ];

  // Function to handle changes in answer for the current question
  const handleChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Function to move to the next step
  const handleNext = () => {
    // Basic validation for the current step's answer
    const currentQuestion = questions[currentStep];
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert("Please select an answer before proceeding.");
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Function to move to the previous step
  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Function to determine the pet recommendation
  const getRecommendation = () => {
    const { activity, size, allergy, location } = answers;
    let recommendedPet = "Dog"; // Default recommendation

    if (allergy === "yes") {
      recommendedPet = "Fish";
    } else if (size === "small" && activity !== "high") {
      recommendedPet = "Cat"; // Cats can be good for small spaces and medium/low activity
    } else if (activity === "low" && allergy === "no") {
      recommendedPet = "Rabbit";
    } else if (activity === "medium" && size === "medium" && allergy === "no") {
      recommendedPet = "Dog (Medium)";
    } else if (activity === "high" && size === "large" && allergy === "no") {
      recommendedPet = "Dog (Large, Active Breed)";
    } else if (activity === "medium" && size === "small" && allergy === "no") {
      recommendedPet = "Hamster or Guinea Pig";
    }
    // You can add more complex logic here for better recommendations

    return recommendedPet;
  };

  // Function to handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Simulate an API call or complex processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const recommendedPet = getRecommendation();

    if (typeof onQuizComplete === "function") {
      onQuizComplete(recommendedPet, answers.location);
    } else {
      console.error("onQuizComplete is not a function");
    }
    setIsLoading(false); // End loading
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="pet-quiz-container">
      <h2 className="quiz-title">Find Your Paw-fect Friend</h2>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        {questions.map((_, index) => (
          <span
            key={index}
            className={`progress-dot ${index === currentStep ? "active" : ""} ${
              index < currentStep ? "completed" : ""
            }`}
          ></span>
        ))}
      </div>
      <p className="step-text">Step {currentStep + 1}/{questions.length}</p>

      {/* Quiz Form */}
      <form onSubmit={handleSubmit} className="quiz-form">
        {/* Render current question */}
        <div className="question-section">
          <p className="question-text">{currentQuestion.question}</p>

          {/* Render different input types based on question config */}
          {currentQuestion.type === "select" && (
            <div className="options-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`option-button ${
                    answers[currentQuestion.id] === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleChange(currentQuestion.id, option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "input" && (
            <input
              type={currentQuestion.inputType}
              name={currentQuestion.id}
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
              placeholder="E.g., New York, NY"
              className="text-input"
              required={currentQuestion.required}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="quiz-navigation">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack} className="nav-button back-button">
              Back
            </button>
          )}

          {!isLastStep && (
            <button type="button" onClick={handleNext} className="nav-button next-button">
              Next Step {">"}
            </button>
          )}

          {isLastStep && (
            <button type="submit" className="nav-button submit-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Finding Pet...
                </>
              ) : (
                "Find My Pet"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PetQuiz;