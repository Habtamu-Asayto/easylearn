 

-- Employee tables 
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL, 
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id), 
  UNIQUE (user_email) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_info` (
  `user_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_full_name` varchar(255) NOT NULL, 
  `user_phone` varchar(255) NOT NULL,
  PRIMARY KEY (user_info_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_pass` (
  `user_pass_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_password_hashed` varchar(255) NOT NULL,
  PRIMARY KEY (user_pass_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `user_role` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL, 
  `role_name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (user_role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `course_category` (
    `category_id` INT AUTO_INCREMENT , 
    `name` VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (category_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `courses` (
    `course_id` INT AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `category_id` INT,
    `instructor_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id),
    FOREIGN KEY (instructor_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES course_category(category_id)
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Lessons` (
    `lesson_id` INT AUTO_INCREMENT,
    `course_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `video_url` VARCHAR(255),
    `attachments` TEXT, 
    `lesson_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Enrollments` (
    `enrollment_id` INT AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (enrollment_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Progress` (
    `progress_id` INT AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `completed_lessons` TEXT,  
    `percentage_completed` FLOAT DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (progress_id),
     FOREIGN KEY (student_id) REFERENCES users(user_id),
     FOREIGN KEY (course_id) REFERENCES courses(course_id),
     UNIQUE(student_id, course_id)
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `CourseReviews` (
    `course_review_id` INT AUTO_INCREMENT,
    `course_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `rating` INT CHECK (rating BETWEEN 1 AND 5),
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (course_review_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    UNIQUE(course_id, student_id)
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `Certificates` (
    `certificate_id` INT AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `issued_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (certificate_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `Contact` (
    `contact_id` INT AUTO_INCREMENT,
    `user_id` INT NULL,   
    `name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `subject` VARCHAR(150),
    `message` TEXT NOT NULL,
    `status` ENUM('new','read','replied') DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `Chat` (
    `chat_id` INT AUTO_INCREMENT ,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `Quiz` (
    `quiz_id` INT AUTO_INCREMENT ,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `total_marks` INT,
    `created_by` INT,  
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (quiz_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB; 
 
CREATE TABLE IF NOT EXISTS `Question` (
    `question_id` INT AUTO_INCREMENT ,
    `quiz_id` INT NOT NULL,
    `question_text` TEXT NOT NULL,
    `question_type` ENUM('mcq','true_false','short_answer') DEFAULT 'mcq',
    `marks` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id),
    FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE
) ENGINE=InnoDB; 
  
CREATE TABLE IF NOT EXISTS `MCQOption` (
    `option_id` INT AUTO_INCREMENT ,
    `question_id` INT NOT NULL,
    `option_text` VARCHAR(255) NOT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (option_id),
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE
) ENGINE=InnoDB; 
  
CREATE TABLE IF NOT EXISTS `UserAnswer` (
    `answer_id` INT AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `selected_option_id` INT NULL,
    `answer_text` TEXT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES MCQOption(option_id) ON DELETE SET NULL
) ENGINE=InnoDB; 
  