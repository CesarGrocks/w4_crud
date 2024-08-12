const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { password } = req.body
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10) // el hash permite encriptar y es asincrono
    //console.log(hashedPassword);
    
    const result = await User.create({ ...req.body, password:
        hashedPassword
    });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    delete req.body.password

    const deleteFields = ['password', 'email']

    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
  const {email,password} = req.body
  // vamos a buscar en la db, al usuario asociado a este email, en caso de no encontrarlo, daremos la vista (401) : desautorizado
 
  const user = await User.findOne({ where: { email } })
  //findByPk -> id
  //En caso de que salga mal dar esta respuesta
  if(!user) return res.status(401).json({"message":"Las credenciales ingresadas son incorrectas"})
    //en caso de que salga bien 
 
  const isValid = await bcrypt.compare(password, user.password)
  if(!isValid) return res.status(401).json({"message":"Las credenciales ingresadas son incorrectas"})

    const token = jwt.sign(
       { user },
       process.env.TOKEN_SECRET,
       { expiresIn: '1d' } 
    )

  return res.status(200).json({ user, token })
});

const logged = catchError(async (req, res) => {
    const user = req.user

    return res.json(user)
})


module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    logged
}