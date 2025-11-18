const BASE = "http://localhost:5000/api"  || "https://interview-preparation-1.onrender.com";
let token = localStorage.getItem("token");
let currentUser = null;

// Dark Mode Toggle
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector("#theme-icon");
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Initialize theme on load
initTheme();

// Theme toggle button
document.querySelector("#theme-toggle")?.addEventListener("click", toggleTheme);

// Update header buttons based on login status
function updateHeaderButtons() {
  const loginBtn = document.querySelector("#header-login-btn");
  const logoutBtn = document.querySelector("#header-logout-btn");
  
  if (token) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    // User is not logged in
    if (loginBtn) loginBtn.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// Header login button
document.querySelector("#header-login-btn")?.addEventListener("click", () => {
  location.hash = "#login";
});

// Header logout button
document.querySelector("#header-logout-btn")?.addEventListener("click", () => {
  localStorage.clear();
  token = null;
  currentUser = null;
  updateHeaderButtons();
  location.hash = "#login";
});

// Show pages
function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelector(`#${page}-page`).classList.add("active");
}

// Update dashboard with user info
function updateDashboard() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    currentUser = JSON.parse(userStr);
    const dashboardContent = document.querySelector("#dashboard-content");
    if (dashboardContent && currentUser) {
      dashboardContent.innerHTML = `
        <p><strong>Welcome, ${currentUser.name || currentUser.email}!</strong></p>
        <p>Email: ${currentUser.email}</p>
        <p>Role: ${currentUser.role || 'user'}</p>
        <p style="margin-top: 20px;">Use the navigation menu to:</p>
        <ul>
          <li>Start an interview</li>
          <li>Check plagiarism</li>
          ${currentUser.role === 'admin' ? '<li>View admin results</li><li>Add questions</li>' : ''}
        </ul>
      `;
    }
  }
}

// Check if user is admin and show/hide admin links
function checkAdminAccess() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    const isAdmin = user.email === "aryangupta1467@gmail.com" || user.role === "admin";
    const adminLinks = document.querySelectorAll(".admin-link");
    adminLinks.forEach(link => {
      link.style.display = isAdmin ? "block" : "none";
    });
  } else {
    const adminLinks = document.querySelectorAll(".admin-link");
    adminLinks.forEach(link => {
      link.style.display = "none";
    });
  }
}

// Handle routing
window.addEventListener("hashchange", () => loadPage());
function loadPage() {
  let route = location.hash.replace("#", "") || "login";
  // Allow access to forgot-password, reset-password, feedback, and suggest-question without token
  if (!token && route !== "login" && route !== "register" && route !== "forgot-password" && route !== "reset-password" && route !== "feedback" && route !== "suggest-question") {
    route = "login";
  }
  show(route);
  if (route === "dashboard") {
    updateDashboard();
  }
  checkAdminAccess();
  updateHeaderButtons();
  
  // Auto-fill user info in feedback and suggest question forms
  if (route === "feedback" || route === "suggest-question") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (route === "feedback") {
        const nameInput = document.querySelector("#feedback-name");
        const emailInput = document.querySelector("#feedback-email");
        if (nameInput && !nameInput.value) nameInput.value = user.name || "";
        if (emailInput && !emailInput.value) emailInput.value = user.email || "";
      } else if (route === "suggest-question") {
        const nameInput = document.querySelector("#suggest-name");
        const emailInput = document.querySelector("#suggest-email");
        if (nameInput && !nameInput.value) nameInput.value = user.name || "";
        if (emailInput && !emailInput.value) emailInput.value = user.email || "";
      }
    }
  }
  
  // Handle reset password token from URL
  if (route === "reset-password") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      const tokenInput = document.querySelector("#reset-password-form input[name='token']");
      if (tokenInput) {
        tokenInput.value = token;
      }
    }
  }
}
loadPage();

// LOGIN
document.querySelector("#login-form").onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok && data.success) {
    token = data.token;
    currentUser = data.user;
    localStorage.setItem("token", token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    document.querySelector("#login-msg").textContent = data.message || "Login successful!";
    document.querySelector("#login-msg").style.color = "green";
    updateDashboard();
    checkAdminAccess();
    updateHeaderButtons();
    setTimeout(() => {
      location.hash = "#dashboard";
    }, 500);
  } else {
    document.querySelector("#login-msg").textContent = data.message || "Login failed";
    document.querySelector("#login-msg").style.color = "red";
  }
};

// REGISTER
document.querySelector("#register-form").onsubmit = async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    document.querySelector("#register-msg").textContent = data.message || "Registration successful!";
    document.querySelector("#register-msg").style.color = "green";
    setTimeout(() => {
      location.hash = "#login";
    }, 1500);
  } else {
    document.querySelector("#register-msg").textContent = data.message;
    document.querySelector("#register-msg").style.color = "red";
  }
};

// FORGOT PASSWORD
document.querySelector("#forgot-password-form").onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;

  const res = await fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#forgot-password-msg").textContent = data.message || "Reset token generated!";
    document.querySelector("#forgot-password-msg").style.color = "green";
    
    // Show reset token in development mode
    if (data.resetToken) {
      const tokenDisplay = document.querySelector("#reset-token-display");
      const tokenText = document.querySelector("#reset-token-text");
      tokenText.textContent = data.resetToken;
      tokenDisplay.style.display = "block";
      
      // Auto-redirect to reset password page with token
      setTimeout(() => {
        location.hash = `#reset-password?token=${data.resetToken}`;
      }, 2000);
    }
  } else {
    document.querySelector("#forgot-password-msg").textContent = data.message || "Failed to generate reset token";
    document.querySelector("#forgot-password-msg").style.color = "red";
    document.querySelector("#reset-token-display").style.display = "none";
  }
};

// RESET PASSWORD
document.querySelector("#reset-password-form").onsubmit = async (e) => {
  e.preventDefault();
  const token = e.target.token.value;
  const password = e.target.password.value;

  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ token, password })
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#reset-password-msg").textContent = data.message || "Password reset successful!";
    document.querySelector("#reset-password-msg").style.color = "green";
    e.target.reset();
    setTimeout(() => {
      location.hash = "#login";
    }, 2000);
  } else {
    document.querySelector("#reset-password-msg").textContent = data.message || "Failed to reset password";
    document.querySelector("#reset-password-msg").style.color = "red";
  }
};

// CHANGE PASSWORD
document.querySelector("#change-password-form").onsubmit = async (e) => {
  e.preventDefault();
  const currentPassword = e.target.currentPassword.value;
  const newPassword = e.target.newPassword.value;

  if (!token) {
    document.querySelector("#change-password-msg").textContent = "Please login first";
    document.querySelector("#change-password-msg").style.color = "red";
    return;
  }

  const res = await fetch(`${BASE}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#change-password-msg").textContent = data.message || "Password changed successfully!";
    document.querySelector("#change-password-msg").style.color = "green";
    e.target.reset();
  } else {
    document.querySelector("#change-password-msg").textContent = data.message || "Failed to change password";
    document.querySelector("#change-password-msg").style.color = "red";
  }
};

// Store current interview data
let currentInterview = {
  questions: [],
  topic: ""
};

// START INTERVIEW
document.querySelector("#start-form").onsubmit = async (e) => {
  e.preventDefault();

  const questionType = document.querySelector("#question-type-filter").value;
  const body = {
    category: e.target.category.value,
    difficulty: e.target.difficulty.value,
    numQuestions: parseInt(e.target.numQuestions.value),
    topic: e.target.topic.value,
    questionType: questionType
  };

  const res = await fetch(`${BASE}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok && data.success) {
    currentInterview.questions = data.questions;
    currentInterview.topic = body.topic;
    
    // Count question types
    const mcqCount = data.questions.filter(q => q.type === 'mcq').length;
    const descCount = data.questions.filter(q => q.type === 'descriptive').length;
    
    let box = document.querySelector("#questions-box");
    box.innerHTML = `<h3>Test Started - ${data.count} Questions</h3>` + 
      `<p style="color: #666;">MCQ: ${mcqCount} | Descriptive: ${descCount}</p>` +
      data.questions.map((q, idx) =>
        `<div style="margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
          <strong>Q${idx + 1}:</strong> ${q.question} ${q.type === 'mcq' ? '<span style="color: #059669; font-weight: bold;">[MCQ]</span>' : '<span style="color: #2563eb;">[Descriptive]</span>'}
        </div>`
      ).join("");
    
    // Show answer section
    document.querySelector("#answers-section").style.display = "block";
    
    // Set instructions
    const instructionsDiv = document.querySelector("#test-instructions");
    if (mcqCount > 0 && descCount === 0) {
      instructionsDiv.innerHTML = `<strong>📝 Instructions:</strong> This is an MCQ test. Select the correct option for each question. Only one option can be selected per question.`;
    } else if (mcqCount === 0 && descCount > 0) {
      instructionsDiv.innerHTML = `<strong>📝 Instructions:</strong> This is a descriptive test. Write detailed answers for each question.`;
    } else {
      instructionsDiv.innerHTML = `<strong>📝 Instructions:</strong> This test contains both MCQ and descriptive questions. For MCQ questions, select one option. For descriptive questions, write detailed answers.`;
    }
    
    const answersContainer = document.querySelector("#answers-container");
    answersContainer.innerHTML = data.questions.map((q, idx) => {
      if (q.type === 'mcq' && q.options && q.options.length > 0) {
        // MCQ question with radio buttons
        return `
          <div style="margin: 20px 0; padding: 20px; border: 2px solid #059669; border-radius: 8px; background: #f0fdf4;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #059669;">Q${idx + 1} [MCQ]:</strong> ${q.question}
            </div>
            <div style="margin-top: 15px; padding-left: 10px;">
              ${q.options.map((option, optIdx) => `
                <div style="margin: 12px 0; padding: 10px; background: white; border-radius: 6px; border: 1px solid #d1d5db; transition: all 0.2s;">
                  <label style="display: flex; align-items: center; cursor: pointer; margin: 0;">
                    <input type="radio" name="question-${q._id}" value="${optIdx}" data-question-id="${q._id}" data-question-type="mcq" required style="margin-right: 12px; width: 20px; height: 20px; cursor: pointer;">
                    <span style="font-size: 15px;"><strong>${String.fromCharCode(65 + optIdx)}.</strong> ${option}</span>
                  </label>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        // Descriptive question with textarea
        return `
          <div style="margin: 20px 0; padding: 20px; border: 2px solid #2563eb; border-radius: 8px; background: #eff6ff;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #2563eb;">Q${idx + 1} [Descriptive]:</strong> ${q.question}
            </div>
            <textarea data-question-id="${q._id}" data-question-type="descriptive" placeholder="Write your detailed answer here..." style="width: 100%; margin-top: 15px; min-height: 120px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit;" required></textarea>
          </div>
        `;
      }
    }).join("");
    
    document.querySelector("#start-msg").textContent = "";
    document.querySelector("#start-msg").style.color = "";
    
    // Scroll to answers section
    document.querySelector("#answers-section").scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    document.querySelector("#start-msg").textContent = data.message || "Failed to start interview";
    document.querySelector("#start-msg").style.color = "red";
    document.querySelector("#answers-section").style.display = "none";
  }
};

// SUBMIT ALL ANSWERS
document.querySelector("#submit-all-btn").onclick = async (e) => {
  e.preventDefault();
  
  if (!currentInterview.questions || currentInterview.questions.length === 0) {
    alert("Please start an interview first!");
    return;
  }

  const answersContainer = document.querySelector("#answers-container");
  const answers = [];

  let allFilled = true;
  
  // Process all questions (both MCQ and descriptive)
  currentInterview.questions.forEach((q) => {
    const questionId = q._id;
    
    if (q.type === 'mcq') {
      // Handle MCQ - get selected radio button
      const selectedRadio = answersContainer.querySelector(`input[name="question-${questionId}"]:checked`);
      if (!selectedRadio) {
        allFilled = false;
        return;
      }
      
      answers.push({
        questionId: questionId,
        selectedOptionIndex: parseInt(selectedRadio.value),
        userAnswer: "" // Not needed for MCQ
      });
    } else {
      // Handle descriptive - get textarea value
      const textarea = answersContainer.querySelector(`textarea[data-question-id="${questionId}"]`);
      if (!textarea || !textarea.value.trim()) {
        allFilled = false;
        return;
      }
      
      answers.push({
        questionId: questionId,
        userAnswer: textarea.value.trim()
      });
    }
  });

  if (!allFilled) {
    alert("Please answer all questions before submitting!");
    return;
  }

  const body = {
    topic: currentInterview.topic,
    answers: answers
  };

  try {
    const res = await fetch(`${BASE}/interview/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      document.querySelector("#start-msg").innerHTML = 
        `<div style="color: green; padding: 15px; background: #f0fdf4; border-radius: 8px; margin-top: 20px;">
          <strong>${data.message || "Submitted successfully!"}</strong><br>
          <strong>Total Score: ${data.totalScore}%</strong><br>
          ${data.feedback || ""}
        </div>`;
      document.querySelector("#answers-section").style.display = "none";
      currentInterview = { questions: [], topic: "" };
    } else {
      document.querySelector("#start-msg").textContent = data.message || "Submission failed";
      document.querySelector("#start-msg").style.color = "red";
    }
  } catch (error) {
    document.querySelector("#start-msg").textContent = "Error submitting answers: " + error.message;
    document.querySelector("#start-msg").style.color = "red";
  }
};

// PLAGIARISM
document.querySelector("#plagiarism-form").onsubmit = async (e) => {
  e.preventDefault();
  const userAnswer = e.target.userAnswer.value;
  const aiAnswer = e.target.aiAnswer.value;

  if (!userAnswer || !aiAnswer) {
    document.querySelector("#plagiarism-msg").textContent = "Both answers are required";
    document.querySelector("#plagiarism-msg").style.color = "red";
    return;
  }

  const res = await fetch(`${BASE}/plagiarism/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ userAnswer, aiAnswer })
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#plagiarism-msg").innerHTML = 
      `<div style="padding: 15px; background: #f6f9fc; border-radius: 8px; margin-top: 15px;">
        <strong>Similarity:</strong> ${data.similarity.toFixed(2)}%<br>
        <strong>Originality:</strong> ${data.originality.toFixed(2)}%
      </div>`;
  } else {
    document.querySelector("#plagiarism-msg").textContent = data.message || "Check failed";
    document.querySelector("#plagiarism-msg").style.color = "red";
  }
};

// ADMIN RESULTS
document.querySelector("#fetch-results-btn").onclick = async () => {
  if (!token) {
    document.querySelector("#admin-check-msg").textContent = "Please login first";
    document.querySelector("#admin-check-msg").style.color = "red";
    return;
  }

  const res = await fetch(`${BASE}/admin/results`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#admin-check-msg").textContent = "";
    const resultsDiv = document.querySelector("#admin-results");
    if (data.data && data.data.length > 0) {
      resultsDiv.innerHTML = `<h3>Total Results: ${data.count}</h3>` +
        data.data.map(result => `
          <div style="margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9fafb;">
            <strong>User:</strong> ${result.userId?.name || 'N/A'} (${result.userId?.email || 'N/A'})<br>
            <strong>Topic:</strong> ${result.topic || 'N/A'}<br>
            <strong>Total Score:</strong> ${result.totalScore}%<br>
            <strong>Date:</strong> ${new Date(result.createdAt).toLocaleString()}<br>
            <strong>Answers:</strong> ${result.answers?.length || 0} questions
          </div>
        `).join("");
    } else {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  } else {
    document.querySelector("#admin-check-msg").textContent = data.message || "Failed to fetch results. Make sure you are logged in as admin.";
    document.querySelector("#admin-check-msg").style.color = "red";
    document.querySelector("#admin-results").innerHTML = "";
  }
};

// Handle question type toggle in admin form
document.querySelector("#question-type").addEventListener("change", (e) => {
  const type = e.target.value;
  const descriptiveFields = document.querySelector("#descriptive-fields");
  const mcqFields = document.querySelector("#mcq-fields");
  const correctAnswerField = document.querySelector("#correct-answer-field");
  
  if (type === "mcq") {
    descriptiveFields.style.display = "none";
    mcqFields.style.display = "block";
    correctAnswerField.removeAttribute("required");
  } else {
    descriptiveFields.style.display = "block";
    mcqFields.style.display = "none";
    correctAnswerField.setAttribute("required", "required");
  }
});

// Add option button for MCQ
let optionCount = 2;
document.querySelector("#add-option-btn").addEventListener("click", () => {
  const container = document.querySelector("#mcq-options-container");
  const optionDiv = document.createElement("div");
  optionDiv.className = "mcq-option";
  optionDiv.innerHTML = `
    <input type="text" class="mcq-option-input" placeholder="Option ${optionCount + 1}" required>
    <label><input type="radio" name="correct-option" value="${optionCount}"> Correct</label>
  `;
  container.appendChild(optionDiv);
  optionCount++;
});

// ADMIN ADD QUESTION
document.querySelector("#add-form").onsubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    document.querySelector("#admin-add-check-msg").textContent = "Please login first";
    document.querySelector("#admin-add-check-msg").style.color = "red";
    return;
  }

  const questionType = e.target.type.value;
  const body = {
    category: e.target.category.value,
    difficulty: e.target.difficulty.value,
    question: e.target.question.value,
    type: questionType
  };

  if (questionType === "mcq") {
    // Collect MCQ options
    const optionInputs = document.querySelectorAll(".mcq-option-input");
    const options = Array.from(optionInputs).map(input => input.value.trim()).filter(val => val);
    
    if (options.length < 2) {
      document.querySelector("#admin-add-check-msg").textContent = "MCQ must have at least 2 options";
      document.querySelector("#admin-add-check-msg").style.color = "red";
      return;
    }

    // Get selected correct option index
    const correctRadio = document.querySelector('input[name="correct-option"]:checked');
    if (!correctRadio) {
      document.querySelector("#admin-add-check-msg").textContent = "Please select the correct option";
      document.querySelector("#admin-add-check-msg").style.color = "red";
      return;
    }

    body.options = options;
    body.correctOptionIndex = parseInt(correctRadio.value);
  } else {
    // Descriptive question
    body.correctAnswer = e.target.correctAnswer.value;
    if (!body.correctAnswer) {
      document.querySelector("#admin-add-check-msg").textContent = "Please provide correct answer";
      document.querySelector("#admin-add-check-msg").style.color = "red";
      return;
    }
  }

  const res = await fetch(`${BASE}/questions/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok && data.success) {
    document.querySelector("#admin-add-check-msg").textContent = "";
    document.querySelector("#add-msg").textContent = data.message || "Question added successfully!";
    document.querySelector("#add-msg").style.color = "green";
    e.target.reset();
    // Reset MCQ fields
    optionCount = 2;
    document.querySelector("#mcq-options-container").innerHTML = `
      <div class="mcq-option">
        <input type="text" class="mcq-option-input" placeholder="Option 1" required>
        <label><input type="radio" name="correct-option" value="0" required> Correct</label>
      </div>
      <div class="mcq-option">
        <input type="text" class="mcq-option-input" placeholder="Option 2" required>
        <label><input type="radio" name="correct-option" value="1"> Correct</label>
      </div>
    `;
    document.querySelector("#descriptive-fields").style.display = "block";
    document.querySelector("#mcq-fields").style.display = "none";
  } else {
    document.querySelector("#admin-add-check-msg").textContent = data.message || "Failed to add question. Make sure you are logged in as admin.";
    document.querySelector("#admin-add-check-msg").style.color = "red";
    document.querySelector("#add-msg").textContent = "";
  }
};

// LOGOUT
document.querySelector("#logout-btn").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  token = null;
  currentUser = null;
  updateHeaderButtons();
  location.hash = "#login";
};

// Initialize header buttons on page load
updateHeaderButtons();

// FEEDBACK FORM
document.querySelector("#feedback-form").onsubmit = async (e) => {
  e.preventDefault();
  const feedback = e.target.feedback.value;
  const name = e.target.name.value;
  const email = e.target.email.value;

  if (!feedback.trim()) {
    document.querySelector("#feedback-msg").textContent = "Please enter your feedback";
    document.querySelector("#feedback-msg").style.color = "red";
    return;
  }

  const body = { feedback, name, email };
  
  // Add auth token if user is logged in
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  try {
    const res = await fetch(`${BASE}/feedback/submit`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      document.querySelector("#feedback-msg").textContent = data.message || "Thank you for your feedback!";
      document.querySelector("#feedback-msg").style.color = "green";
      e.target.reset();
    } else {
      document.querySelector("#feedback-msg").textContent = data.message || "Failed to submit feedback";
      document.querySelector("#feedback-msg").style.color = "red";
    }
  } catch (error) {
    document.querySelector("#feedback-msg").textContent = "Error submitting feedback: " + error.message;
    document.querySelector("#feedback-msg").style.color = "red";
  }
};

// SUGGEST QUESTION FORM - Question Type Toggle
document.querySelector("#suggest-question-type")?.addEventListener("change", (e) => {
  const type = e.target.value;
  const mcqFields = document.querySelector("#suggest-mcq-fields");
  const descriptiveField = document.querySelector("#suggest-descriptive-field");
  
  if (type === "mcq") {
    if (mcqFields) mcqFields.style.display = "block";
    if (descriptiveField) descriptiveField.style.display = "none";
  } else if (type === "descriptive") {
    if (mcqFields) mcqFields.style.display = "none";
    if (descriptiveField) descriptiveField.style.display = "block";
  } else {
    if (mcqFields) mcqFields.style.display = "none";
    if (descriptiveField) descriptiveField.style.display = "none";
  }
});

// SUGGEST QUESTION - Add Option Button
let suggestOptionCount = 2;
document.querySelector("#suggest-add-option-btn")?.addEventListener("click", () => {
  const container = document.querySelector("#suggest-mcq-options-container");
  if (!container) return;
  
  const optionDiv = document.createElement("div");
  optionDiv.className = "mcq-option";
  optionDiv.innerHTML = `
    <input type="text" class="suggest-mcq-option-input" placeholder="Option ${suggestOptionCount + 1}">
    <label><input type="radio" name="suggest-correct-option" value="${suggestOptionCount}"> Correct</label>
  `;
  container.appendChild(optionDiv);
  suggestOptionCount++;
});

// SUGGEST QUESTION FORM
document.querySelector("#suggest-question-form").onsubmit = async (e) => {
  e.preventDefault();
  const question = e.target.question.value;
  const name = e.target.name.value;
  const email = e.target.email.value;
  const category = e.target.category.value;
  const difficulty = e.target.difficulty.value;
  const type = e.target.type.value;
  const additionalNotes = e.target.additionalNotes.value;

  if (!question.trim()) {
    document.querySelector("#suggest-question-msg").textContent = "Please enter a question";
    document.querySelector("#suggest-question-msg").style.color = "red";
    return;
  }

  const body = {
    question,
    name,
    email,
    category: category || undefined,
    difficulty: difficulty || undefined,
    type: type || undefined,
    additionalNotes: additionalNotes || undefined
  };

  // Handle MCQ options
  if (type === "mcq") {
    const optionInputs = document.querySelectorAll(".suggest-mcq-option-input");
    const options = Array.from(optionInputs).map(input => input.value.trim()).filter(val => val);
    
    if (options.length > 0) {
      body.options = options;
      const correctRadio = document.querySelector('input[name="suggest-correct-option"]:checked');
      if (correctRadio) {
        body.correctOptionIndex = parseInt(correctRadio.value);
      }
    }
  }

  // Handle descriptive answer
  if (type === "descriptive") {
    const correctAnswer = e.target.correctAnswer?.value;
    if (correctAnswer) {
      body.correctAnswer = correctAnswer;
    }
  }

  // Add auth token if user is logged in
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  try {
    const res = await fetch(`${BASE}/feedback/question-suggestion`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      document.querySelector("#suggest-question-msg").textContent = data.message || "Thank you for your question suggestion!";
      document.querySelector("#suggest-question-msg").style.color = "green";
      e.target.reset();
      suggestOptionCount = 2;
      // Reset MCQ fields
      const container = document.querySelector("#suggest-mcq-options-container");
      if (container) {
        container.innerHTML = `
          <div class="mcq-option">
            <input type="text" class="suggest-mcq-option-input" placeholder="Option 1">
            <label><input type="radio" name="suggest-correct-option" value="0"> Correct</label>
          </div>
          <div class="mcq-option">
            <input type="text" class="suggest-mcq-option-input" placeholder="Option 2">
            <label><input type="radio" name="suggest-correct-option" value="1"> Correct</label>
          </div>
        `;
      }
      document.querySelector("#suggest-mcq-fields").style.display = "none";
      document.querySelector("#suggest-descriptive-field").style.display = "none";
    } else {
      document.querySelector("#suggest-question-msg").textContent = data.message || "Failed to submit question suggestion";
      document.querySelector("#suggest-question-msg").style.color = "red";
    }
  } catch (error) {
    document.querySelector("#suggest-question-msg").textContent = "Error submitting suggestion: " + error.message;
    document.querySelector("#suggest-question-msg").style.color = "red";
  }
};
