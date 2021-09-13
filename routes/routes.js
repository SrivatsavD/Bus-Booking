const express = require('express');
const db = require("../models/index.js");
const Op = db.Sequelize.Op;
const model = require("../app/routers/routers.js");
let router = express.Router();

router.post("/api/bus", async (req, res) =>{
  const values = req.body;
    const busValues = {
       name: req.body.name,
       // source: req.body.source,
       // destination: req.body.destination,
       seats: req.body.seats,
       categoryId_1: req.body.categoryId_1,
       categoryId_2: req.body.categoryId_2
     };

     // const categValue1 = await model.findOne({where: { id: busValues.categoryId_1}}, "Category");
     // const categValue2 = await model.findOne({where: { id: busValues.categoryId_2}}, "Category");

     // if( 1 <= categValue1 <= 2  && 3 <= categValue2 <= 5 ){

      const head = await model.create(busValues, 'Bus');

      values.routes.forEach((route) => {
        route.busId = head.id;
      })
      await db.Route.bulkCreate(values.routes,{ individualHooks: true});
      res.status(201).send("Bus added!!");
// }

  // else {
  //   res.status(500).send({
  //     message: "Enter correct categoryId_1 and categoryId_2!!"
  //   });
  // }
});

router.post("/api/category", (req, res) =>{
    const categValues = {
       name: req.body.name
     };

  model.create(categValues, 'Category')
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the category."
      });
    });
});

// router.post("/api/date-bus-mapper", async (req, res) =>{
//
//     // await db.Bus.
//
//     const values = {
//        date: req.body.date,
//        seatsAvailable: req.body.seatsAvailable,
//        busId: req.body.busId
//      };
//
//   model.create(values, 'Date_Bus_Mapper')
//     .then(data => {
//       res.status(201).send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the date-bus mapper."
//       });
//     });
// });

router.put("/api/bus/:id", async (req, res) => {
  const ID = req.params.id;
  const route = [];
  const routeItems = await db.Route.findAll({where: {}});

  db.Bus.update(req.body, { where: { id: ID } } );

  if( req.body.route ){


    req.body.route.forEach((item) => {
      const routeValues = {
      id: item.id,
      method: item.method,
      source: item.source,
      destination: item.destination,
      price: item.price,
      busId: ID
    }
    // console.log(11);
    route.push(routeValues);
    })

    // console.log(7);
    route.forEach((items) => {
      // console.log(item);
      if(items.method === "create"){
        // console.log(1);
        const routes = {
          source: items.source,
          destination: items.destination,
          price: items.price,
          busId: ID
        }
        // console.log(2);
        model.create(routes, "Route");
        // console.log(3);
      }
      // console.log(8);

      if( items.method === "update"){
        db.Route.update({
          source: items.source,
          destination: items.destination,
          price: items.price,
          busId: ID
        }, {
          where: {
            id: items.id
           }
         });
      }

      // console.log(9);
      if( items.method === "delete"){
        db.Route.destroy({
          where: {
            id: items.id
          }
        })
    }
  })
}
  res.status(200).send("Bus Updated!!!");
});

// router.post("/api/route", (req, res) =>{
//     const routeValues = {
//        pickup: req.body.pickup,
//        drop: req.body.drop,
//        price: req.body.price
//      };
//
//   model.create(routeValues, 'Route')
//     .then(data => {
//       res.status(201).send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the route."
//       });
//     });
// });

router.post("/api/booking", async (req, res) =>{

  const bookingValues = {
    qty: req.body.qty,
    status: req.body.status,
    amount: req.body.amount,
    totalAmount: (req.body.qty) * (req.body.amount),
    busId: req.body.busId,
    routeId: req.body.routeId
   };

   const busValue = await model.findOne({ where: {id: bookingValues.busId }}, "Bus");
   const routeValue = await model.findOne({ where: { id: bookingValues.routeId }}, "Route");
   const mapper = await model.findOne( { where: { date: new Date(req.body.date), busId: bookingValues.busId }}, "Date_Bus_Mapper" );
   let map = {};

   if( busValue.id && routeValue.id ){

      if( mapper ){
        await db.Date_Bus_Mapper.update({
          seatsAvailable: (mapper.seatsAvailable - bookingValues.qty)
        },
          {
            where: {
              date: mapper.date,
              busId : bookingValues.busId
            }
          });
          bookingValues.date_busId = mapper.id;
        }

      else{
        const dateMapper = {
          date: req.body.date,
          seatsAvailable: (busValue.seats - bookingValues.qty),
          busId: bookingValues.busId
        }
        map = await model.create(dateMapper, "Date_Bus_Mapper");
        bookingValues.date_busId = map.id;
      }

        model.create(bookingValues, 'Booking');
        res.status(201).send(bookingValues);

  }

  else{
    res.status(500).send({
      message: "Enter correct busId and routeId!!"
      });
    }
  });

  router.get("/api/bus", (req, res) => {
    const options = req.query;

    let categorySearchFilter = {};
    if (options.categorySearchQuery) {
      categorySearchFilter = {
        name: {
        [Op.iLike]: `%${options.categorySearchQuery}%`
        }
      }
    }

    let dateBus = {};
    if (options.dateBusQuery){
      dateBus = {
        date: new Date(`${options.dateBusQuery}`)
      }
    }

    let pickupQuery = {};
    if(options.source){
      pickupQuery = {
        source: {
          [Op.iLike]: `%${options.source}%`
        }
      }
    }

    let dropQuery = {};
    if(options.destination){
      dropQuery = {
        destination: {
          [Op.iLike]: `%${options.destination}%`
        }
      }
    }

    const filter = {
      where: {},
      include: [
        {
          model: db.Date_Bus_Mapper,
          where: dateBus,
          required: true
        },
        {
          model: db.Route,
          where: pickupQuery,
          required: true
        },
        {
          model: db.Route,
          where: dropQuery,
          required: true
        },
         {
          model: db.Category,
          where: categorySearchFilter,
          required: false,
          as: 'category1'
        },
         {
          model: db.Category,
          where: categorySearchFilter,
          required: false,
          as: 'category2'
        }
      ]
    };

    if(options.categoryId_1){
      filter.where.categoryId_1 = options.categoryId_1;
    }

    if(options.categoryId_2){
      filter.where.categoryId_2 = options.categoryId_2;
    }

    if(options.busSearchQuery){
      filter.where.name = {
        [Op.iLike]: `%${options.busSearchQuery}%`
      }
    }

    model.findAll(filter, 'Bus')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bus."
      });
    });
  });

router.get("/api/bus/findall", (req, res) => {
  const filter = {
    where: {},
    };
    model.findAll(filter, 'Bus')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving buses."
      });
    });
  });

  router.get("/api/category/findall", (req, res) => {
    const filter = {
      where: {},
    };
    model.findAll(filter, 'Category')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });
  });

  router.get("/api/route/findall", (req, res) => {
    const filter = {
      where: {},
    };
    model.findAll(filter, 'Route')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving routes."
      });
    });
  });

router.get("/api/booking/findall", (req, res) => {
  const filter = {
    where: {},
  };
  model.findAll(filter, 'Booking')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving bookings."
    });
  });
});

router.get("/api/date-bus-mapper/findall", (req, res) => {
  const filter = {
    where: {},
  };
  model.findAll(filter, 'Date_Bus_Mapper')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving date-bus-mappers."
    });
  });
});

router.get("/api/bus/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Bus')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving bus with id=" + id
    });
  });
});

router.get("/api/category/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Category')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving category with id=" + id
    });
  });
});

router.get("/api/route/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Route')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving route with id=" + id
    });
  });
});

router.get("/api/booking/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Booking')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving booking with id=" + id
    });
  });
});

router.get("/api/date-bus-mapper/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Date_Bus_Mapper')
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving date-bus-mappers with id=" + id
    });
  });
});

module.exports = router;
