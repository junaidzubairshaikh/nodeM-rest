var environments={};

environments.staging={
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging',
    'hashingSecret':'thisissecret',
    'twilio':{
        'accoundSid':'AC558a86bd84df2b5670c48ee646ddd51f',
        'authToken':'697e6ce81c39b3cd5174c05846dea01a',
        'from':'+923423678748'
    }
}

environments.production={
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production',
    'hashingSecret':'thisissecret',
    'twilio':{
        'accoundSid':'AC558a86bd84df2b5670c48ee646ddd51f',
        'authToken':'697e6ce81c39b3cd5174c05846dea01a',
        'from':'+923423678748'
    }
}

var currentEnvironment=typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLocaleLowerCase():'';

var exportEnvironment=typeof(environments[currentEnvironment])=='object'?environments[currentEnvironment]:environments.staging;

module.exports=exportEnvironment;
