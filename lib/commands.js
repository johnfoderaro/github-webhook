// 'use strict';

// const cache = require('./cache');
// const file = require('./../lib/file');
// const format = require('./format');
// const queue = require('./queue');
// const socket = require('./socket');
// const spawn = require('child_process').spawn;

// const build = cache();
// const status = cache();
// const warning = cache();

// function deploy(res, project) {

//   return new Promise((resolve, reject) => {
//     let i = 0;
//     const commands = project.commands;
//     queue('add', project);

//     // check for duplicates and emit an event
//     if (project.name === build().name) {
//       socket(res, 'duplicate', {
// 				project: build(),
//         activity: status(),
//         duplicate: warning(project.name),
//         queue: queue()
//       });
//     }

//     // queue builds and emit an event
//     if (queue().length > 1 && project.name !== build().name) {
//       socket(res, 'queue', {
//         project: build(),
//         activity: status(),
//         duplicate: warning(),
//         queue: queue()
//       });
//     }

//     // execute build and emit an event
//     if (queue().length === 1 && project.name !== build().name) {
// 			build(queue()[0]);
//       project.start = new Date();
//       execute(commands[i], next);
//     }

//     function execute(command, next) {
//       if (project.error instanceof Error) {
//         project.end = new Date();
//         project.error = new Error('Project not enabled.');
//         project.log.push(project.error);
//         project.start = new Date();
//         project.status = false;
//         socket(res, 'fail', {
//           project: format(build()),
//           activity: status(false),
//           duplicate: warning(false),
//           queue: queue('remove', project)
//         });
//         return done();
//       }

//       // cache constants for the log and child_process spawn
//       const log = project.log;
//       const item = spawn(command[0], command[1], {
// 				cwd: command[2],
// 				env: process.env
// 			});

//       socket(res, 'activity', {
//         project: build(),
// 				activity: status({
//           item: i,
//           status: command[3],
//           total: commands.length
//         }),
// 				duplicate: warning(),
// 				queue: queue()
//       });

//       // push stdout/stderr/errors events to project's log array
//       item.stdout.on('data', data => log.push(data.toString()));
//       item.stderr.on('data', data => log.push(data.toString()));
//       item.on('error', data => log.push(data.toString()));

//       // on close if error is greater than 0, kill the project build
//       item.on('close', (code) => {
//         if (code > 0) {
//           project.status = false;
//           project.end = new Date();
//           project.error = new Error(code);
//           socket(res, 'fail', {
//             project: format(build()),
//             activity: status(false),
//             duplicate: warning(false),
//             queue: queue('remove', project)
//           });
//           return done();
//         }
//         next();
//       });
//     }

//     function next() {
//       i += 1;
//       if (i < commands.length) {
//         execute(commands[i], next);
//       } else {
//         project.status = true;
//         project.end = new Date();
//         socket(res, 'success', {
//           project: format(project),
//           activity: status(false),
//           duplicate: warning(false),
//           queue: queue('remove', project)
//         });
//         return done();
//       }
//     }

//     function done() {
//       build(false);
//       file('write', {
//         path: `./data/${project.name}.json`,
//         data: project
//       }).then(() => {
//         if (queue().length > 0) {
//           return deploy(res, queue()[0]);
//         } else {
//           return resolve();
//         }
//       }).catch(err => reject(err));
//     }

//   });
// }

// module.exports = deploy;