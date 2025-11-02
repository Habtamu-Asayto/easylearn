 

-- User tables 
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL, 
  `profile_img` VARCHAR(255), 
  `last_seen` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id), 
  UNIQUE (user_email) 
) ENGINE=InnoDB;

-- -- ALTER TABLE users
--   ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN verification_token VARCHAR(128) NULL,
--   ADD COLUMN verification_token_expires DATETIME NULL;

-- -- Optional: index token for faster lookup
-- CREATE INDEX idx_verification_token ON users (verification_token);

CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT AUTO_INCREMENT,
    `sender_id` INT,
    `receiver_id` INT,
    `message` TEXT,
    `unread` BOOLEAN DEFAULT TRUE,
    `is_ai` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (id), 
     FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
     FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
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
  `role_name` INT(11) NOT NULL,
  PRIMARY KEY (user_role_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;
 
CREATE TABLE IF NOT EXISTS `course_category` (
    `category_id` INT AUTO_INCREMENT , 
    `category_name` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS `course_overview`(
    `overview_id` INT AUTO_INCREMENT,
    `overview_detail` TEXT,
    `required_skill` VARCHAR(250),
    `duration` VARCHAR(250),
    `certificate` BOOLEAN DEFAULT FALSE,
    `course_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (overview_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
)ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Chapters` (
  `chapter_id` INT AUTO_INCREMENT,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `color` VARCHAR(50) DEFAULT 'bg-indigo-500',
  `chapter_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chapter_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Lessons` (
  `lesson_id` INT AUTO_INCREMENT,
  `chapter_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `duration` VARCHAR(20),
  `video_url` VARCHAR(255),
  `attachments` JSON DEFAULT NULL,
  `content` TEXT,
  `lesson_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (lesson_id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `Enrollments` (
    `enrollment_id` INT AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (enrollment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(user_id, course_id)
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `LessonProgress` (
    `progress_id` INT AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `lesson_id` INT NOT NULL,
    `completed` TINYINT(1) DEFAULT 0,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`progress_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (`lesson_id`) REFERENCES Lessons(lesson_id) ON DELETE CASCADE,
    UNIQUE KEY `user_lesson_unique` (`user_id`, `lesson_id`)
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
    `quiz_id` INT AUTO_INCREMENT,
    `user_id` INT,
    `chapter_id` INT NOT NULL,
    `question` TEXT NOT NULL,
    `question_type` ENUM('multiple_choice', 'true_false', 'short_answer') DEFAULT 'multiple_choice',
    `points` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`quiz_id`),
    FOREIGN KEY (`chapter_id`) REFERENCES `Chapters`(`chapter_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `QuizOptions` (
  `option_id` INT AUTO_INCREMENT,
  `quiz_id` INT NOT NULL,
  `option_text` VARCHAR(255) NOT NULL,
  `is_correct` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`option_id`),
  FOREIGN KEY (`quiz_id`) REFERENCES Quiz(`quiz_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `QuizAnswers` (
  `answer_id` INT AUTO_INCREMENT,
  `quiz_id` INT NOT NULL,
  `user_id` INT,
  `selected_option_id` INT NULL,         
  `short_answer` TEXT NULL,           
  `is_correct` BOOLEAN DEFAULT NULL,    
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`answer_id`),
  FOREIGN KEY (`quiz_id`) REFERENCES Quiz(`quiz_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
  FOREIGN KEY (`selected_option_id`) REFERENCES QuizOptions(`option_id`)
) ENGINE=InnoDB;
 
CREATE TABLE IF NOT EXISTS `news` (
  `news_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11),
  `title` VARCHAR(200) NOT NULL,         
  `body` TEXT NOT NULL,     
  `pinned` BOOLEAN DEFAULT FALSE,             
  `unread` BOOLEAN DEFAULT TRUE, 
  `audience` VARCHAR(100) DEFAULT 'All', 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`news_id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
) ENGINE=InnoDB;