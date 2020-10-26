

    var fs = require('fs'); 
    var parser = require('./gramatica');
    var ast;
    var astJason;
    try { 
        // leemos nuestro archivo de entrada
        const entrada = fs.readFileSync('./entrada.txt');
        // invocamos a nuestro parser con el contendio del archivo de entradas
        ast = parser.parse(entrada.toString());
    
        console.log("-------------TRADUCTOR--------------");
        console.log(ast.t);
        console.log("-------------IDS--------------");
        console.log(ast.Vid);
        console.log("-------------HTML--------------");
        console.log(ast.VHtml);

        console.log("-------------ERROR--------------");
        console.log(ast.errores);

        console.log("-------------FIN--------------");
        
        ast.VHtml.replace("\n\t","");
        fs.writeFileSync('creado.html', ast.VHtml);

        var himalaya = require('himalaya');
        
        var astjson = himalaya.parse(ast.VHtml);
        var MYJSONHTML = JSON.stringify(astjson);
        console.log(MYJSONHTML);

    } catch (e) {
        
        return;
    }
    






