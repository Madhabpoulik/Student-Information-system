from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100),unique = True,nullable=False)
    password = db.Column(db.String(100),nullable=False)
    email = db.Column(db.String(100),nullable=False)
    isadmin = db.Column(db.Boolean(),nullable=False)
    isactive = db.Column(db.Boolean(),nullable=False)
    student = db.relationship("Student", backref=db.backref("user", uselist=False),lazy=True)

    def __repr__(self):
        return '<User %r>' % self.username



class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer,nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    name = db.Column(db.String(100),nullable=False)
    semester = db.Column(db.String(100),nullable=False)
    phone = db.Column(db.String(100),nullable=False)
    address = db.Column(db.String(200),nullable=False)    
    gender = db.Column(db.String(45),nullable=False)
    fname = db.Column(db.String(100),nullable=False)
    mname = db.Column(db.String(100),nullable=False)
    image = db.Column(db.String(100),nullable=True)
    dob = db.Column(db.Date(),nullable=False)


    courses = relationship("Course", secondary="marks")

    def __repr__(self):
        return '<Student %r>' % self.name


class Branch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    branch_name = db.Column(db.String(100),nullable=False)
    student = db.relationship("Student", backref=db.backref("branch", uselist=False),lazy=True)

    def __repr__(self):
        return '<Branch %r>' % self.branch_name


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100),nullable=False)
    students = relationship("Student", secondary="marks")
    
    def __repr__(self):
        return '<Course %r>' % self.course_name

class Marks(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    marks = db.Column(db.Integer,nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'),nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'),nullable=False)

    student = relationship(Student, backref=backref("marks", cascade="all, delete-orphan"))
    course = relationship(course, backref=backref("marks", cascade="all, delete-orphan"))

    def __repr__(self):
        return '<marks %r>' % self.id