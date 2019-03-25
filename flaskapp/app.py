from flask import Flask,render_template,request,jsonify,json,Response,session,redirect
import datetime
from marshmallow import Schema, fields, pprint, ValidationError
from werkzeug import generate_password_hash, check_password_hash
# from dbconnection import connection
# import MySQLdb
# from MySQLdb import escape_string as thwart
# from flask.ext.sqlalchemy import SQLAlchemy
from models import *
app = Flask(__name__,static_url_path='',static_folder='templates/static/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://sis_app:p@ssword@localhost/sis_project2'
db.init_app(app)


class UserSchema(Schema):
    username = fields.Str(required=True)
    name = fields.Str(required=True)    
    email = fields.Email(required=True)
    dob = fields.Date(required=True)
    gender = fields.Str(required=True)
    f_name = fields.Str(required=True)
    m_name = fields.Str(required=True)
    phone = fields.Str(required=True)
    semester = fields.Integer(required=True)
    branch = fields.Integer(required=True)
    password1 = fields.Str(required=True)
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    pincode = fields.Str(required=True)
    country = fields.Str(required=True)
    state = fields.Str(required=True)
#todo put validation





@app.route("/")
def main():
    return render_template('home.html')

@app.route("/register")
def register():
    return render_template('registration.html')


@app.route('/ajax/get/usernameexists',methods=['POST'])
def usernameExists():
    if request.is_json:
        jsonstr = request.get_json()
        print(jsonstr)
        try:
            username = jsonstr['username']
        except:
            return Response(status=500)
        print(username)
        try:
            exists=1
            if User.query.filter_by(username=username).scalar() is None:
                exists=0
            response = {
                "code":200,
                "exist":exists
            }
            return jsonify(response)
        except:
            print("query error")
            response = {
                "code":500,
            }
            return jsonify(response)

@app.route("/login",methods=['GET','POST'])
def login():
    if session.get('logged_in'):
        return redirect('/')
    errors=[]
    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('pass')
        if username!=None and password!=None:
            u = User.query.filter_by(username=username).first()
            print(u)
            if u != None:
                password_hash = u.password
                active  = u.isactive
                isadmin = u.isadmin
                if check_password_hash(password_hash,password):
                    if active:
                        session['logged_in'] = True
                        session['username'] = username
                        if isadmin:
                            session['isadmin'] = True
                        return redirect('/')
                    else:
                        errors = ['acount has not been activated']
                else:
                    errors = ['wrong username or password']

            else:
                errors = ['that username does not exist']
    return render_template('login_page.html',errors=errors)

@app.route('/logout',methods = ['GET'])
def logout():
    session.pop('logged_in',None)
    session.pop('username',None)
    session.pop('isadmin',None)
    return redirect('/')




        
                        

@app.route("/ajax/post/registeruser",methods=['POST'])
def registerUser():
    if request.is_json:
        jsonstr = request.get_json()
        schema = UserSchema()
        try:
            result = schema.load(jsonstr)
            print(result)
        except ValidationError as err:
            print(err)
            error_list = []
            for e in err.messages:
                error_list.extend(e)
            response = {
                "code":500,
                "errors":error_list
            }
            return jsonify(response)

        try:
            # import pdb;pdb.set_trace();
            hashed_password = generate_password_hash(result['password1'])
            u = User(username = result['username'],password = hashed_password,email=result['email'],isactive=False,isadmin=False)
            
            age = datetime.datetime.now().year - result['dob'].year
            add = result['address']+';'+result['city']+';'+result['state']+';'+result['pincode']+';'+result['country']
            s = Student(
                age=age,
                user=u,
                branch_id=result['branch'],
                name=result['name'],
                semester=result['semester'],
                phone = result['phone'],
                address = add,
                gender = result['gender'],
                fname = result['f_name'],
                mname = result['m_name'],
                dob = result['dob']

                )
            db.session.add(u) 
            db.session.commit()
        except:
            response = {
                "code":500,
            }
            return jsonify(response) 
        response = {
                "code":200,
            }
        return jsonify(response)
    return Response(status=401)
    
@app.route('/admin',methods=['GET'])
def adminPanel():
    if session.get('isadmin'):

        u_list = User.query.filter_by(isactive=False).all()

        return render_template("admin_panel.html",u_list=u_list)
    else:
        return Response("unauthorized",status=401)


@app.route('/ajax/activate_account',methods=['POST'])
def activate_account():
    if session.get('isadmin'):
        jsonstr = request.get_json()
        uid = jsonstr['uid']
        make_admin = jsonstr['make_admin']
        u = User.query.filter_by(id=uid).first()
        if u is not None:
            u.isactive = True
            u.isadmin = make_admin
            db.session.add(u)
            db.session.commit()
            res = {
                'code':200
            }
        else:
            res = {
            'code': 500 
            }
        return jsonify(res)

    else:
        return Response("unauthorized",status=401)







if __name__ == "__main__":
    app.secret_key = "hosuhojfdoasidjpqwe21413"
    app.run(port=8080)