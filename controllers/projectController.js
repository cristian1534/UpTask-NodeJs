const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.projectHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });

  res.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {

    const usuarioId = res.locals.usuario.id;
    const proyecto = await Proyectos.create({ nombre, usuarioId });
    res.redirect("/");
  }
};

exports.projectPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });
  const proyecto = await Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    },
  });

  const tareas = await Tareas.findAll({
    where:{
      proyectoId: proyecto.id
    }
  })

  if (!proyecto) return next();
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
    tareas
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where:{
      usuarioId
    }
  });
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    await Proyectos.update(
      { nombre: nombre },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.redirect("/");
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  const { urlProyecto } = req.query;
  const resultado = await Proyectos.destroy({
    where: {
      url: urlProyecto,
    },
  });
  if(!resultado){
    return next();
  }
  res.status(200).send("Proyecto Eliminado");
};
