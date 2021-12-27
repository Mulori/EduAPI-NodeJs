
module.exports = {
    async index(req, res) {       
        return res.json( { 
            title: 'Hello, welcome, enjoy all the features of our API', 
            description: 'Our API is geared towards educational education systems, with the aim of taking education as far as possible. With the start of development in 2021/12, we want to grow and change the lives of thousands of people.',
            author: 'Murilo Henrique Garcia Rodrigues',
            country: 'Brazil' } );
    },
};
