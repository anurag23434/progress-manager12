// Application Data
const AppData = {
    subjects: {
        "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Euclid Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions"],
        "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in the Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"],
        "English": ["Beehive - Prose and Poetry", "Moments - Supplementary Reader"],
        "Social Studies": ["History: India and the Contemporary World I", "Geography: Contemporary India I", "Political Science: Democratic Politics I", "Economics"],
        "Hindi": ["Vasant - Pathyakram", "Sparsh - Pathyakram"]
    },
    targetScore: 90,
    totalWeeks: 10,
    motivationalQuotes: [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The expert in anything was once a beginner.",
        "Don't watch the clock; do what it does. Keep going.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The only way to do great work is to love what you do.",
        "Your limitation—it's only your imagination.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn't just find you. You have to go out and get it.",
        "The harder you work for something, the greater you'll feel when you achieve it."
    ]
};

// User Progress Data
let UserProgress = {
    subjects: {},
    achievements: [],
    weeklyTasks: {}
};

// Initialize user progress structure
function initializeUserProgress() {
    Object.keys(AppData.subjects).forEach(subject => {
        UserProgress.subjects[subject] = {};
        AppData.subjects[subject].forEach(topic => {
            UserProgress.subjects[subject][topic] = {
                halfYearlyScore: 0,
                currentScore: 0,
                status: 'not-started',
                weeklyTasks: Array(10).fill(''),
                notes: '',
                tasksCompleted: Array(10).fill(false)
            };
        });
    });

    // Initialize weekly tasks structure
    for (let week = 1; week <= 10; week++) {
        UserProgress.weeklyTasks[week] = [];
    }
}

// Navigation Functions
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(viewName).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Load view-specific content
    switch(viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'subjects':
            loadSubjects();
            break;
        case 'planner':
            loadWeeklyPlanner();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Dashboard Functions
function loadDashboard() {
    updateDashboardStats();
    displayMotivationalQuote();
    loadSubjectsOverview();
    loadAchievements();
}

function updateDashboardStats() {
    const stats = calculateOverallStats();
    
    document.getElementById('overallProgress').textContent = `${stats.overallProgress}%`;
    document.getElementById('completedTopics').textContent = stats.completedTopics;
    document.getElementById('pendingTopics').textContent = stats.pendingTopics;
    document.getElementById('averageScore').textContent = `${stats.averageScore}%`;
}

function calculateOverallStats() {
    let totalTopics = 0;
    let completedTopics = 0;
    let totalScore = 0;
    let scoredTopics = 0;

    Object.keys(UserProgress.subjects).forEach(subject => {
        Object.keys(UserProgress.subjects[subject]).forEach(topic => {
            totalTopics++;
            const topicData = UserProgress.subjects[subject][topic];
            
            if (topicData.status === 'completed') {
                completedTopics++;
            }
            
            if (topicData.currentScore > 0) {
                totalScore += topicData.currentScore;
                scoredTopics++;
            }
        });
    });

    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const averageScore = scoredTopics > 0 ? Math.round(totalScore / scoredTopics) : 0;

    return {
        overallProgress,
        completedTopics,
        pendingTopics: totalTopics - completedTopics,
        averageScore
    };
}

function displayMotivationalQuote() {
    const today = new Date().getDate();
    const quote = AppData.motivationalQuotes[today % AppData.motivationalQuotes.length];
    document.getElementById('dailyQuote').textContent = `"${quote}"`;
}

function loadSubjectsOverview() {
    const subjectsGrid = document.getElementById('subjectsGrid');
    subjectsGrid.innerHTML = '';

    Object.keys(AppData.subjects).forEach(subject => {
        const subjectStats = calculateSubjectStats(subject);
        const subjectCard = createSubjectCard(subject, subjectStats);
        subjectsGrid.appendChild(subjectCard);
    });
}

function calculateSubjectStats(subject) {
    const topics = UserProgress.subjects[subject];
    let totalScore = 0;
    let scoredTopics = 0;
    let completedTopics = 0;
    let totalTopics = Object.keys(topics).length;

    Object.values(topics).forEach(topic => {
        if (topic.currentScore > 0) {
            totalScore += topic.currentScore;
            scoredTopics++;
        }
        if (topic.status === 'completed') {
            completedTopics++;
        }
    });

    const averageScore = scoredTopics > 0 ? Math.round(totalScore / scoredTopics) : 0;
    const progress = Math.round((completedTopics / totalTopics) * 100);

    return { averageScore, progress, completedTopics, totalTopics };
}

function createSubjectCard(subject, stats) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.onclick = () => {
        showView('subjects');
        loadSubjectDetails(subject);
    };

    const progressClass = stats.averageScore >= 90 ? 'high' : stats.averageScore >= 75 ? 'medium' : 'low';

    card.innerHTML = `
        <div class="subject-header">
            <h3 class="subject-name">${subject}</h3>
            <div class="subject-score ${progressClass}">${stats.averageScore}%</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar">
                <div class="progress-fill ${progressClass}" style="width: ${stats.progress}%"></div>
            </div>
        </div>
        <div class="subject-stats">
            <span>${stats.completedTopics}/${stats.totalTopics} topics completed</span>
            <span>Target: 90%</span>
        </div>
    `;

    return card;
}

function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';

    if (UserProgress.achievements.length === 0) {
        achievementsList.innerHTML = `
            <div class="achievement-item">
                <div class="achievement-emoji">🎯</div>
                <div class="achievement-text">
                    <div class="achievement-title">Ready to Start!</div>
                    <div class="achievement-desc">Complete your first topic to earn your first achievement</div>
                </div>
            </div>
        `;
    } else {
        UserProgress.achievements.slice(-3).forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-item';
            achievementElement.innerHTML = `
                <div class="achievement-emoji">${achievement.emoji}</div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            achievementsList.appendChild(achievementElement);
        });
    }
}

// Subjects Functions
function loadSubjects() {
    const subjectTabs = document.getElementById('subjectTabs');
    subjectTabs.innerHTML = '';

    Object.keys(AppData.subjects).forEach((subject, index) => {
        const tab = document.createElement('button');
        tab.className = `subject-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = subject;
        tab.onclick = () => {
            document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadSubjectDetails(subject);
        };
        subjectTabs.appendChild(tab);
    });

    // Load first subject by default
    if (Object.keys(AppData.subjects).length > 0) {
        loadSubjectDetails(Object.keys(AppData.subjects)[0]);
    }
}

function loadSubjectDetails(subject) {
    const subjectContent = document.getElementById('subjectContent');
    subjectContent.innerHTML = `<h3>${subject} - Topics</h3><div class="topics-list" id="topicsList"></div>`;

    const topicsList = document.getElementById('topicsList');
    
    AppData.subjects[subject].forEach(topic => {
        const topicCard = createTopicCard(subject, topic);
        topicsList.appendChild(topicCard);
    });
}

function createTopicCard(subject, topic) {
    const topicData = UserProgress.subjects[subject][topic];
    const card = document.createElement('div');
    card.className = 'topic-card';

    card.innerHTML = `
        <div class="topic-header">
            <h4 class="topic-name">${topic}</h4>
            <span class="topic-status ${topicData.status}">${getStatusText(topicData.status)}</span>
        </div>
        
        <div class="topic-details">
            <div class="detail-group">
                <label class="detail-label">Half Yearly Score (%)</label>
                <input type="number" class="detail-input" min="0" max="100" 
                       value="${topicData.halfYearlyScore}" 
                       onchange="updateTopicData('${subject}', '${topic}', 'halfYearlyScore', this.value)">
            </div>
            <div class="detail-group">
                <label class="detail-label">Current Score (%)</label>
                <input type="number" class="detail-input" min="0" max="100" 
                       value="${topicData.currentScore}" 
                       onchange="updateTopicData('${subject}', '${topic}', 'currentScore', this.value)">
            </div>
            <div class="detail-group">
                <label class="detail-label">Status</label>
                <select class="detail-input" onchange="updateTopicData('${subject}', '${topic}', 'status', this.value)">
                    <option value="not-started" ${topicData.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                    <option value="in-progress" ${topicData.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${topicData.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        </div>

        <div class="weekly-tasks">
            <h4>📅 Weekly Task Planner</h4>
            <div class="tasks-grid">
                ${generateWeeklyTaskInputs(subject, topic, topicData.weeklyTasks)}
            </div>
        </div>

        <div class="notes-section">
            <label class="detail-label">Notes & Remarks</label>
            <textarea class="notes-textarea" placeholder="Add your notes here..."
                      onchange="updateTopicData('${subject}', '${topic}', 'notes', this.value)">${topicData.notes}</textarea>
        </div>
    `;

    return card;
}

function generateWeeklyTaskInputs(subject, topic, tasks) {
    let html = '';
    for (let week = 1; week <= 10; week++) {
        html += `
            <div>
                <label class="detail-label">Week ${week}</label>
                <input type="text" class="task-input" placeholder="Task for week ${week}"
                       value="${tasks[week - 1]}" 
                       onchange="updateWeeklyTask('${subject}', '${topic}', ${week - 1}, this.value)">
            </div>
        `;
    }
    return html;
}

function getStatusText(status) {
    switch(status) {
        case 'not-started': return 'Not Started';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        default: return 'Not Started';
    }
}

function updateTopicData(subject, topic, field, value) {
    // Fixed: Properly parse numeric values and ensure they stay within 0-100 range
    let processedValue = value;
    
    if (field === 'halfYearlyScore' || field === 'currentScore') {
        processedValue = Math.min(Math.max(parseInt(value) || 0, 0), 100);
    }
    
    UserProgress.subjects[subject][topic][field] = processedValue;
    
    // Check for achievements
    if (field === 'currentScore' && processedValue >= 90) {
        checkAchievements(subject, topic, processedValue);
    }
    
    if (field === 'status' && value === 'completed') {
        checkAchievements(subject, topic);
    }
    
    // Update dashboard if on dashboard view
    if (document.getElementById('dashboard').classList.contains('active')) {
        updateDashboardStats();
        loadSubjectsOverview();
        loadAchievements();
    }
}

function updateWeeklyTask(subject, topic, weekIndex, task) {
    UserProgress.subjects[subject][topic].weeklyTasks[weekIndex] = task;
    
    // Update weekly planner data
    updateWeeklyPlannerData();
}

function updateWeeklyPlannerData() {
    // Clear existing weekly tasks
    for (let week = 1; week <= 10; week++) {
        UserProgress.weeklyTasks[week] = [];
    }
    
    // Rebuild weekly tasks from all subjects
    Object.keys(UserProgress.subjects).forEach(subject => {
        Object.keys(UserProgress.subjects[subject]).forEach(topic => {
            const topicData = UserProgress.subjects[subject][topic];
            topicData.weeklyTasks.forEach((task, index) => {
                if (task.trim()) {
                    UserProgress.weeklyTasks[index + 1].push({
                        subject,
                        topic,
                        task,
                        completed: topicData.tasksCompleted[index]
                    });
                }
            });
        });
    });
}

// Weekly Planner Functions
function loadWeeklyPlanner() {
    updateWeeklyPlannerData();
    const plannerGrid = document.getElementById('plannerGrid');
    plannerGrid.innerHTML = '';

    for (let week = 1; week <= 10; week++) {
        const weekCard = createWeekCard(week, UserProgress.weeklyTasks[week]);
        plannerGrid.appendChild(weekCard);
    }
}

function createWeekCard(weekNumber, tasks) {
    const card = document.createElement('div');
    card.className = 'week-card';

    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    card.innerHTML = `
        <div class="week-header">
            Week ${weekNumber} (${completedTasks}/${tasks.length} completed - ${progressPercent}%)
        </div>
        <div class="week-tasks">
            ${tasks.length === 0 ? '<p style="color: var(--color-text-secondary); font-style: italic;">No tasks planned</p>' : 
              tasks.map((task, index) => `
                <div class="task-item">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTaskCompletion('${task.subject}', '${task.topic}', ${weekNumber - 1}, ${index})">
                    <div class="task-text ${task.completed ? 'completed' : ''}">${task.task}</div>
                    <div class="task-subject">${task.subject}</div>
                </div>
              `).join('')}
        </div>
    `;

    return card;
}

function toggleTaskCompletion(subject, topic, weekIndex, taskIndexInWeek) {
    // Find the task in the subject's data and toggle completion
    const topicData = UserProgress.subjects[subject][topic];
    const taskText = UserProgress.weeklyTasks[weekIndex + 1][taskIndexInWeek].task;
    
    // Find the matching task in the topic's weekly tasks
    const topicTaskIndex = topicData.weeklyTasks.findIndex(task => task === taskText);
    if (topicTaskIndex !== -1) {
        topicData.tasksCompleted[topicTaskIndex] = !topicData.tasksCompleted[topicTaskIndex];
        
        // Check for achievement
        if (topicData.tasksCompleted[topicTaskIndex]) {
            checkTaskCompletionAchievements();
        }
    }
    
    // Reload planner to reflect changes
    loadWeeklyPlanner();
}

// Analytics Functions
function loadAnalytics() {
    setTimeout(() => {
        createProgressChart();
        createSubjectChart();
        loadImprovementAreas();
        loadPerformanceSummary();
    }, 100);
}

function createProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Generate sample progress data over 10 weeks
    const weeks = Array.from({length: 10}, (_, i) => `Week ${i + 1}`);
    const progressData = generateProgressOverTime();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [{
                label: 'Overall Progress %',
                data: progressData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createSubjectChart() {
    const ctx = document.getElementById('subjectChart').getContext('2d');
    
    const subjects = Object.keys(AppData.subjects);
    const scores = subjects.map(subject => calculateSubjectStats(subject).averageScore);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: subjects,
            datasets: [{
                data: scores,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function generateProgressOverTime() {
    // Generate realistic progress data based on current completion status
    const stats = calculateOverallStats();
    const currentProgress = stats.overallProgress;
    
    // Create a growth curve that leads to current progress
    const progressData = [];
    for (let i = 0; i < 10; i++) {
        // Create realistic progression with some variance
        let progress = Math.min(currentProgress * (i + 1) / 10, 100);
        
        // Add some realistic variance but keep it reasonable
        if (i > 0) {
            progress += (Math.random() - 0.5) * 5;
            progress = Math.max(0, Math.min(100, progress));
        }
        
        progressData.push(Math.round(progress));
    }
    
    // Ensure the last point reflects current progress
    progressData[9] = currentProgress;
    
    return progressData;
}

function loadImprovementAreas() {
    const improvementList = document.getElementById('improvementList');
    improvementList.innerHTML = '';

    const subjects = Object.keys(AppData.subjects);
    const subjectScores = subjects.map(subject => ({
        subject,
        score: calculateSubjectStats(subject).averageScore
    }));

    // Sort by lowest scores
    subjectScores.sort((a, b) => a.score - b.score);

    // Show subjects that need improvement (below 90%)
    const improvementNeeded = subjectScores.filter(item => item.score < 90);
    
    if (improvementNeeded.length === 0) {
        improvementList.innerHTML = '<p style="color: var(--color-success);">🎉 Great job! All subjects are performing well!</p>';
    } else {
        // Show top 3 areas for improvement
        improvementNeeded.slice(0, 3).forEach(item => {
            const improvementItem = document.createElement('div');
            improvementItem.className = 'improvement-item';
            improvementItem.innerHTML = `
                <span class="improvement-subject">${item.subject}</span>
                <span class="improvement-score">${item.score}%</span>
            `;
            improvementList.appendChild(improvementItem);
        });
    }
}

function loadPerformanceSummary() {
    const performanceSummary = document.getElementById('performanceSummary');
    const stats = calculateOverallStats();
    
    const totalTopics = stats.completedTopics + stats.pendingTopics;
    const targetProgress = stats.averageScore >= 90 ? 'Target Achieved! 🎯' : `Need ${90 - stats.averageScore}% more`;
    
    performanceSummary.innerHTML = `
        <div class="summary-item">
            <span>Total Topics</span>
            <span>${totalTopics}</span>
        </div>
        <div class="summary-item">
            <span>Completed Topics</span>
            <span>${stats.completedTopics}</span>
        </div>
        <div class="summary-item">
            <span>Average Score</span>
            <span style="color: ${stats.averageScore >= 90 ? 'var(--color-success)' : stats.averageScore >= 75 ? 'var(--color-warning)' : 'var(--color-error)'}">${stats.averageScore}%</span>
        </div>
        <div class="summary-item">
            <span>Target Status</span>
            <span style="color: ${stats.averageScore >= 90 ? 'var(--color-success)' : 'var(--color-warning)'}">${targetProgress}</span>
        </div>
    `;
}

// Achievement System
function checkAchievements(subject, topic, score) {
    const achievements = [];

    // First topic completed
    if (UserProgress.subjects[subject][topic].status === 'completed' && 
        UserProgress.achievements.filter(a => a.type === 'first_completion').length === 0) {
        achievements.push({
            type: 'first_completion',
            emoji: '🎉',
            title: 'First Steps!',
            description: `Completed your first topic: ${topic}`
        });
    }

    // 90% or above score
    if (score && score >= 90) {
        achievements.push({
            type: 'high_score',
            emoji: '⭐',
            title: 'Excellence!',
            description: `Scored ${score}% in ${topic}!`
        });
    }

    // Subject mastery (all topics in subject completed)
    const subjectTopics = Object.keys(UserProgress.subjects[subject]);
    const completedInSubject = subjectTopics.filter(t => 
        UserProgress.subjects[subject][t].status === 'completed'
    ).length;
    
    if (completedInSubject === subjectTopics.length && 
        !UserProgress.achievements.some(a => a.type === 'subject_mastery' && a.subject === subject)) {
        achievements.push({
            type: 'subject_mastery',
            emoji: '🏆',
            title: 'Subject Master!',
            description: `Completed all topics in ${subject}!`,
            subject: subject
        });
    }

    // Add achievements and show modal for new ones
    achievements.forEach(achievement => {
        UserProgress.achievements.push(achievement);
        showAchievementModal(achievement);
    });
}

function checkTaskCompletionAchievements() {
    let totalCompletedTasks = 0;
    Object.keys(UserProgress.subjects).forEach(subject => {
        Object.keys(UserProgress.subjects[subject]).forEach(topic => {
            totalCompletedTasks += UserProgress.subjects[subject][topic].tasksCompleted.filter(Boolean).length;
        });
    });

    // Weekly warrior achievement
    if (totalCompletedTasks >= 10 && 
        !UserProgress.achievements.some(a => a.type === 'task_warrior')) {
        const achievement = {
            type: 'task_warrior',
            emoji: '💪',
            title: 'Task Warrior!',
            description: 'Completed 10 weekly tasks!'
        };
        UserProgress.achievements.push(achievement);
        showAchievementModal(achievement);
    }
}

function showAchievementModal(achievement) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('modalMessage');
    
    message.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">${achievement.emoji}</div>
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
    `;
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeUserProgress();
    
    // Navigation event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const viewName = btn.getAttribute('data-view');
            showView(viewName);
        });
    });

    // Close modal when clicking outside
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Load dashboard initially
    showView('dashboard');
});

// Utility functions for data persistence simulation
function saveProgress() {
    // In a real app, this would save to localStorage or a server
    console.log('Progress saved:', UserProgress);
}

function loadProgress() {
    // In a real app, this would load from localStorage or a server
    console.log('Progress loaded');
}

// Auto-save every 30 seconds
setInterval(saveProgress, 30000);