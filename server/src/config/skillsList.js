/**
 * Comprehensive list of developer skills with associated levels.
 * Each entry maps a skill keyword (lowercase) to the skill display name.
 */
const SKILLS_LIST = [
  // Languages
  { keyword: 'java', name: 'Java' },
  { keyword: 'javascript', name: 'JavaScript' },
  { keyword: 'typescript', name: 'TypeScript' },
  { keyword: 'python', name: 'Python' },
  { keyword: 'c#', name: 'C#' },
  { keyword: 'c++', name: 'C++' },
  { keyword: 'golang', name: 'Go' },
  { keyword: ' go ', name: 'Go' },
  { keyword: 'rust', name: 'Rust' },
  { keyword: 'kotlin', name: 'Kotlin' },
  { keyword: 'swift', name: 'Swift' },
  { keyword: 'php', name: 'PHP' },
  { keyword: 'ruby', name: 'Ruby' },
  { keyword: 'scala', name: 'Scala' },
  { keyword: 'r programming', name: 'R' },
  { keyword: 'perl', name: 'Perl' },
  { keyword: 'dart', name: 'Dart' },
  { keyword: 'elixir', name: 'Elixir' },
  { keyword: 'clojure', name: 'Clojure' },
  { keyword: 'haskell', name: 'Haskell' },

  // .NET ecosystem
  { keyword: '.net', name: '.NET' },
  { keyword: 'asp.net', name: 'ASP.NET' },
  { keyword: '.net core', name: '.NET Core' },
  { keyword: '.net framework', name: '.NET Framework' },
  { keyword: 'blazor', name: 'Blazor' },
  { keyword: 'wpf', name: 'WPF' },
  { keyword: 'xamarin', name: 'Xamarin' },
  { keyword: 'entity framework', name: 'Entity Framework' },

  // Java ecosystem
  { keyword: 'spring boot', name: 'Spring Boot' },
  { keyword: 'spring', name: 'Spring' },
  { keyword: 'hibernate', name: 'Hibernate' },
  { keyword: 'maven', name: 'Maven' },
  { keyword: 'gradle', name: 'Gradle' },
  { keyword: 'jakarta', name: 'Jakarta EE' },
  { keyword: 'jpa', name: 'JPA' },
  { keyword: 'junit', name: 'JUnit' },
  { keyword: 'micronaut', name: 'Micronaut' },
  { keyword: 'quarkus', name: 'Quarkus' },

  // Python ecosystem
  { keyword: 'django', name: 'Django' },
  { keyword: 'flask', name: 'Flask' },
  { keyword: 'fastapi', name: 'FastAPI' },
  { keyword: 'sqlalchemy', name: 'SQLAlchemy' },
  { keyword: 'pandas', name: 'Pandas' },
  { keyword: 'numpy', name: 'NumPy' },
  { keyword: 'scikit-learn', name: 'scikit-learn' },
  { keyword: 'tensorflow', name: 'TensorFlow' },
  { keyword: 'pytorch', name: 'PyTorch' },
  { keyword: 'celery', name: 'Celery' },

  // JavaScript / Frontend
  { keyword: 'react', name: 'React' },
  { keyword: 'angular', name: 'Angular' },
  { keyword: 'vue', name: 'Vue.js' },
  { keyword: 'vue.js', name: 'Vue.js' },
  { keyword: 'next.js', name: 'Next.js' },
  { keyword: 'nuxt', name: 'Nuxt.js' },
  { keyword: 'svelte', name: 'Svelte' },
  { keyword: 'redux', name: 'Redux' },
  { keyword: 'webpack', name: 'Webpack' },
  { keyword: 'vite', name: 'Vite' },
  { keyword: 'node.js', name: 'Node.js' },
  { keyword: 'nodejs', name: 'Node.js' },
  { keyword: 'express', name: 'Express.js' },
  { keyword: 'nestjs', name: 'NestJS' },
  { keyword: 'graphql', name: 'GraphQL' },
  { keyword: 'jquery', name: 'jQuery' },

  // Databases
  { keyword: 'postgresql', name: 'PostgreSQL' },
  { keyword: 'mysql', name: 'MySQL' },
  { keyword: 'mongodb', name: 'MongoDB' },
  { keyword: 'redis', name: 'Redis' },
  { keyword: 'elasticsearch', name: 'Elasticsearch' },
  { keyword: 'cassandra', name: 'Cassandra' },
  { keyword: 'oracle', name: 'Oracle DB' },
  { keyword: 'mssql', name: 'MS SQL Server' },
  { keyword: 'sql server', name: 'MS SQL Server' },
  { keyword: 'sqlite', name: 'SQLite' },
  { keyword: 'dynamodb', name: 'DynamoDB' },
  { keyword: 'neo4j', name: 'Neo4j' },
  { keyword: 'mariadb', name: 'MariaDB' },

  // Cloud & DevOps
  { keyword: 'aws', name: 'AWS' },
  { keyword: 'azure', name: 'Azure' },
  { keyword: 'google cloud', name: 'Google Cloud' },
  { keyword: 'gcp', name: 'Google Cloud' },
  { keyword: 'docker', name: 'Docker' },
  { keyword: 'kubernetes', name: 'Kubernetes' },
  { keyword: 'terraform', name: 'Terraform' },
  { keyword: 'ansible', name: 'Ansible' },
  { keyword: 'jenkins', name: 'Jenkins' },
  { keyword: 'gitlab ci', name: 'GitLab CI' },
  { keyword: 'github actions', name: 'GitHub Actions' },
  { keyword: 'ci/cd', name: 'CI/CD' },
  { keyword: 'helm', name: 'Helm' },
  { keyword: 'nginx', name: 'Nginx' },
  { keyword: 'apache', name: 'Apache' },

  // Testing
  { keyword: 'jest', name: 'Jest' },
  { keyword: 'mocha', name: 'Mocha' },
  { keyword: 'cypress', name: 'Cypress' },
  { keyword: 'selenium', name: 'Selenium' },
  { keyword: 'pytest', name: 'pytest' },
  { keyword: 'testng', name: 'TestNG' },
  { keyword: 'tdd', name: 'TDD' },
  { keyword: 'bdd', name: 'BDD' },

  // Architecture / Concepts
  { keyword: 'microservices', name: 'Microservices' },
  { keyword: 'rest api', name: 'REST API' },
  { keyword: 'restful', name: 'RESTful' },
  { keyword: 'soap', name: 'SOAP' },
  { keyword: 'message queue', name: 'Message Queue' },
  { keyword: 'rabbitmq', name: 'RabbitMQ' },
  { keyword: 'kafka', name: 'Apache Kafka' },
  { keyword: 'grpc', name: 'gRPC' },
  { keyword: 'oauth', name: 'OAuth' },
  { keyword: 'jwt', name: 'JWT' },
  { keyword: 'solid', name: 'SOLID Principles' },
  { keyword: 'design patterns', name: 'Design Patterns' },
  { keyword: 'agile', name: 'Agile' },
  { keyword: 'scrum', name: 'Scrum' },

  // Version Control
  { keyword: 'git', name: 'Git' },
  { keyword: 'github', name: 'GitHub' },
  { keyword: 'gitlab', name: 'GitLab' },
  { keyword: 'bitbucket', name: 'Bitbucket' },

  // Mobile
  { keyword: 'android', name: 'Android' },
  { keyword: 'ios', name: 'iOS' },
  { keyword: 'react native', name: 'React Native' },
  { keyword: 'flutter', name: 'Flutter' },
];

/**
 * Level keywords used to determine skill proficiency.
 */
const LEVEL_KEYWORDS = [
  { pattern: /\bexpert\b/i, level: 'Expert' },
  { pattern: /\badvanced\b/i, level: 'Advanced' },
  { pattern: /\bproficient\b/i, level: 'Proficient' },
  { pattern: /\bintermediate\b/i, level: 'Intermediate' },
  { pattern: /\bbasic\b/i, level: 'Basic' },
  { pattern: /\bfamiliar\b/i, level: 'Familiar' },
  { pattern: /\bbeginner\b/i, level: 'Beginner' },
  { pattern: /\bworking knowledge\b/i, level: 'Intermediate' },
  { pattern: /\bstrong\b/i, level: 'Advanced' },
];

module.exports = { SKILLS_LIST, LEVEL_KEYWORDS };
