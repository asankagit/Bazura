const { transform } = require('@babel/core');
const { parse } = require('@babel/parser');
const jscmodule = require('./jsc/jsc');


const { customParse: plugin } = require('./babel-token-plugin'); // Example plugin

const code = `
const x = sin(30);
console.log(x);
x
`;

let jsc_eval;
const Module = {
    preRun: [(function () {
        jsc_eval = jsc_runtime.cwrap('jsc_eval', 'string', ['string']);
    })],
    postRun: [],
    print: (function () {
        return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            term.echo(text);
        };
    })(),
    printErr: function (text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);
        term.echo(text);
    },
    setStatus: function (text) {
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
        if (text === Module.setStatus.text) return;
        term.echo(text);
    },
    totalDependencies: 0,
    monitorRunDependencies: function (left) {
        //this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... ' : 'All downloads complete.');
        if (left) {
            term.set_prompt("");
        } else {
            term.set_prompt("JSC &gt;&gt;&gt; ");
        }
    }
};

try {
    const ast = parse(code);
    console.log(JSON.stringify(ast))
} catch (error) {
    console.error('Parsing error:', error.message);
}

try {
    const transformedCode = transform(code, {
        plugins: [plugin],
    }).code;



    const wasmloader = async (untrustedCode) => {
        const promise = await new Promise((resolve, reject) => {
            try {
                jscmodule['onRuntimeInitialized'] = async () => {
                    const result = ASM_JS.cwrap('jsc_eval', "string", ['string'])(untrustedCode)
                    resolve(result)
                }
            } catch (jscError) {
                reject(jscError)
            }
        });
        return promise;
    }

    wasmloader(transformedCode).then(msg => console.log({msg})).catch(e => console.log(e))
    console.log(transformedCode);
} catch (error) {
    console.error(error)
}
