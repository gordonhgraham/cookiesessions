
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.string('user_name');
    table.string('first_name');
    table.string('last_name');
    table.string('password');
    table.boolean('is_admin');
  }).then(function(data){
    return knex('users')
          .insert({user_name:'admin', first_name:'admin', last_name:'admin', password:'$2a$10$DfE0oDl.8PZtOyKLBTXzVuq/rEEEDol3jYoAiC486HWQp6nCVuwnW', is_admin:true});
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
