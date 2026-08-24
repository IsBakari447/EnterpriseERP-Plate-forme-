CREATE TABLE "EducationStudent" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "matricule" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3),
  "gender" TEXT,
  "className" TEXT,
  "level" TEXT,
  "address" TEXT,
  "guardianName" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "enrollmentDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'Actif',
  "photoUrl" TEXT,
  "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationStudent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationTeacher" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "teacherCode" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "specialty" TEXT,
  "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "contractType" TEXT,
  "hireDate" TIMESTAMP(3),
  "salary" DOUBLE PRECISION,
  "classes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "availability" JSONB,
  "status" TEXT NOT NULL DEFAULT 'Actif',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationTeacher_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationClass" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "level" TEXT,
  "capacity" INTEGER NOT NULL DEFAULT 0,
  "teacherName" TEXT,
  "room" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Actif',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationClass_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationCourse" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "level" TEXT,
  "subject" TEXT,
  "teacherName" TEXT,
  "weeklyHours" INTEGER,
  "program" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Actif',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationCourse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationScheduleEntry" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "courseName" TEXT NOT NULL,
  "className" TEXT NOT NULL,
  "teacherName" TEXT NOT NULL,
  "room" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "recurrence" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Planifie',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationScheduleEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationExam" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "className" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "teacherName" TEXT,
  "participants" INTEGER NOT NULL DEFAULT 0,
  "average" DOUBLE PRECISION,
  "status" TEXT NOT NULL DEFAULT 'Programme',
  "results" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationExam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationAttendance" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "className" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "justification" TEXT,
  "teacherName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationAttendance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EducationSchoolFee" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "className" TEXT,
  "feeName" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dueDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'A relancer',
  "paymentMethod" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EducationSchoolFee_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EducationStudent_companyId_matricule_key" ON "EducationStudent"("companyId", "matricule");
CREATE INDEX "EducationStudent_companyId_idx" ON "EducationStudent"("companyId");

CREATE UNIQUE INDEX "EducationTeacher_companyId_teacherCode_key" ON "EducationTeacher"("companyId", "teacherCode");
CREATE INDEX "EducationTeacher_companyId_idx" ON "EducationTeacher"("companyId");

CREATE UNIQUE INDEX "EducationClass_companyId_name_key" ON "EducationClass"("companyId", "name");
CREATE INDEX "EducationClass_companyId_idx" ON "EducationClass"("companyId");

CREATE UNIQUE INDEX "EducationCourse_companyId_code_key" ON "EducationCourse"("companyId", "code");
CREATE INDEX "EducationCourse_companyId_idx" ON "EducationCourse"("companyId");

CREATE INDEX "EducationScheduleEntry_companyId_idx" ON "EducationScheduleEntry"("companyId");
CREATE INDEX "EducationScheduleEntry_date_idx" ON "EducationScheduleEntry"("date");

CREATE INDEX "EducationExam_companyId_idx" ON "EducationExam"("companyId");
CREATE INDEX "EducationExam_date_idx" ON "EducationExam"("date");

CREATE INDEX "EducationAttendance_companyId_idx" ON "EducationAttendance"("companyId");
CREATE INDEX "EducationAttendance_date_idx" ON "EducationAttendance"("date");

CREATE INDEX "EducationSchoolFee_companyId_idx" ON "EducationSchoolFee"("companyId");
CREATE INDEX "EducationSchoolFee_dueDate_idx" ON "EducationSchoolFee"("dueDate");

ALTER TABLE "EducationStudent"
  ADD CONSTRAINT "EducationStudent_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationTeacher"
  ADD CONSTRAINT "EducationTeacher_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationClass"
  ADD CONSTRAINT "EducationClass_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationCourse"
  ADD CONSTRAINT "EducationCourse_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationScheduleEntry"
  ADD CONSTRAINT "EducationScheduleEntry_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationExam"
  ADD CONSTRAINT "EducationExam_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationAttendance"
  ADD CONSTRAINT "EducationAttendance_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EducationSchoolFee"
  ADD CONSTRAINT "EducationSchoolFee_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
