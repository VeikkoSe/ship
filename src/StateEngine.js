function StateEngine()
{



    // instance of the singleton
    this.singletonInstance = null;

    // Get the instance of the SingletonClass
    // If there is no instance in this.singletonInstance, instanciate one
    var getInstance = function() {
        if (!this.singletonInstance) {
            // create a instance
            this.singletonInstance = createInstance();
        }

        // return the instance of the singletonClass
        return this.singletonInstance;
    }

    // function for the creation of the SingletonClass class
    var createInstance = function() {



    }

    // wen constructed the getInstance is automaticly called and return the SingletonClass instance
    return getInstance();
}


