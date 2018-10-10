new Vue({
  el: '#app',
  data: {
    attackerLevel: 1,
    attackerName: "Sebastian",
  	attackerHealthpointsStart: 100,
  	attackerHealthpoints: 100,
  	attackerHealth: 100,
    attackerArmor: 250,
    attackerDamage: 15,
    attackerAttributes: [
        10, 10, 10, 10, 10, 10
    ],
    defenderLevel: 1,
    defenderName: "Max",
  	defenderHealthpointsStart: 100,
  	defenderHealthpoints: 100,
    defenderHealth: 100,
    defenderArmor: 250,
    defenderDamage: 15,
    defenderAttributes: [
        10, 10, 10, 10, 10, 10
    ],
    isDisabled: false,
    messages: [],
    isOver: false,
    result: '',
    isWon: '',
    bodyParts: [
        "head", "shoulder", "chest", "arm", "hand", "leg", "foot"
    ]
  },
  watch: {
      attackerLevel: function() {
        this.attackerHealthpointsStart = this.attackerLevel * 100;
        this.attackerHealthpoints = this.attackerLevel * 100;
        this.attackerArmor = this.attackerLevel * 250;
        this.attackerDamage = this.attackerLevel * 15;
        this.attackerAttributes = [
            this.attackerLevel * 10,
            this.attackerLevel * 10,
            this.attackerLevel * 10,
            this.attackerLevel * 10,
            this.attackerLevel * 10,
            this.attackerLevel * 10
        ];
      },
      defenderLevel: function() {
        this.defenderHealthpointsStart = this.defenderLevel * 100;
        this.defenderHealthpoints = this.defenderLevel * 100;
        this.defenderArmor = this.defenderLevel * 250;
        this.defenderDamage = this.defenderLevel * 15;
        this.defenderAttributes = [
            this.defenderLevel * 10,
            this.defenderLevel * 10,
            this.defenderLevel * 10,
            this.defenderLevel * 10,
            this.defenderLevel * 10,
            this.defenderLevel * 10
        ]
      }
  },
  methods: {
    calculateChances: function(me, enemy, type) {
        var full = me + enemy;

        return Math.floor((me * 100 / full) / type);
    },
    calculateReduce: function(level, armor) {
        var reduce = Math.floor(armor / (level * 10));
        if (reduce < 50) {
            return reduce;
        } else {
            return 50;
        }
    },
    getRandom: function(min, max) {
        var min = Math.ceil(min);
        var max = Math.floor(max);

        return Math.floor(Math.random() * (max - min)) + min;
    },
    reload: function () {
        var vm = this;

        vm.isDisabled = false;    
        vm.messages = [],
        vm.isOver = false,

        vm.attackerHealthpoints = vm.attackerHealthpointsStart;
        vm.defenderHealthpoints = vm.defenderHealthpointsStart;
    },
    attack: function () {
        var vm = this;

        vm.isDisabled = true;
        
        var fight = setInterval(function() {
            vm.attackerHealth = Math.floor(vm.attackerHealthpoints * 100 / vm.attackerHealthpointsStart);
            vm.defenderHealth = Math.floor(vm.defenderHealthpoints * 100 / vm.defenderHealthpointsStart);

            // attacker

            if (vm.attackerHealthpoints > 0 && vm.defenderHealthpoints > 0) {
                var hit = Math.floor(Math.random(0, 10) * 100);

                if (hit <= vm.calculateChances(vm.attackerAttributes[2], vm.defenderAttributes[1], 1)) {
                    var heal = Math.floor(Math.random(0, 1) * 100);

                    if (heal <= vm.calculateChances(vm.attackerAttributes[4], vm.defenderAttributes[4], 3)) {
                        if ((vm.attackerHealthpoints + vm.attackerDamage) < vm.attackerHealthpointsStart) {
                            vm.attackerHealthpoints += vm.attackerDamage;
                        } else {
                            vm.attackerHealthpoints = vm.attackerHealthpointsStart;
                        }
                        
                        attackerMessage = '<span class="badge badge-light">' + vm.attackerName + ' conjures healing</span> <span class="badge badge-info">+' + vm.attackerDamage + ' HP</span>';
                    } else {
                        attackerMessage = '<span class="badge badge-light">' + vm.attackerName + ' has evaded</span>';
                    }                    
                } else {
                    var crit = Math.floor(Math.random(0, 1) * 100);
                    var reduce = vm.calculateReduce(vm.defenderLevel, vm.attackerArmor);
                    var damage = Math.floor(vm.defenderDamage * (100 - reduce) / 100);
                    
                    if (crit <= vm.calculateChances(vm.defenderAttributes[3], vm.attackerAttributes[3], 2)) {
                        vm.attackerHealthpoints -= damage * 2;
                        attackerMessage = '<span class="badge badge-light">Critical strike against the ' + vm.bodyParts[vm.getRandom(0, 6)] + '</span> <span class="badge badge-danger">-' + damage * 2 + ' HP</span>';
                    } else {
                        vm.attackerHealthpoints -= damage;
                        attackerMessage = '<span class="badge badge-light">Light punch against the ' + vm.bodyParts[vm.getRandom(0, 6)] + '</span> <span class="badge badge-warning">-' + damage + ' HP</span>';
                    }
                }
            }

            // defender

            if (vm.defenderHealthpoints > 0 && vm.attackerHealthpoints > 0) {
                var hit = Math.floor(Math.random(0, 1) * 100);

                if (hit <= vm.calculateChances(vm.defenderAttributes[2], vm.attackerAttributes[1], 1)) {
                    var heal = Math.floor(Math.random(0, 1) * 100);

                    if (heal <= vm.calculateChances(vm.defenderAttributes[4], vm.attackerAttributes[4], 3)) {
                        if ((vm.defenderHealthpoints + vm.defenderDamage) < vm.defenderHealthpointsStart) {
                            vm.defenderHealthpoints += vm.defenderDamage;
                        } else {
                            vm.defenderHealthpoints = vm.defenderHealthpointsStart;
                        }
                        
                        defenderMessage = '<span class="badge badge-info">+' + vm.defenderDamage + ' HP</span> <span class="badge badge-light">' + vm.defenderName + ' conjures healing</span>';
                    } else {
                        defenderMessage = '<span class="badge badge-light">' + vm.defenderName + ' has evaded</span>';
                    }  
                    
                } else {
                    var crit = Math.floor(Math.random(0, 1) * 100);
                    var reduce = vm.calculateReduce(vm.attackerLevel, vm.defenderArmor);
                    var damage = Math.floor(vm.attackerDamage * (100 - reduce) / 100);

                    if (crit <= vm.calculateChances(vm.attackerAttributes[3], vm.defenderAttributes[3], 2)) {
                        vm.defenderHealthpoints -= damage * 2;
                        defenderMessage = '<span class="badge badge-danger">-' + damage * 2 + ' HP</span> <span class="badge badge-light">Critical strike against the ' + vm.bodyParts[vm.getRandom(0, 6)] + '</span>';
                    } else {
                        vm.defenderHealthpoints -= damage;
                        defenderMessage = '<span class="badge badge-warning">-' + damage + ' HP</span> <span class="badge badge-light">Light punch against the ' + vm.bodyParts[vm.getRandom(0, 6)] + '</span>';
                    }
                }  
            }

            // messages

            if (vm.defenderHealthpoints > 0 && vm.attackerHealthpoints > 0) {
                vm.messages.unshift({
                    'attacker': attackerMessage,
                    'defender': defenderMessage
                });
            }

            // result

            if (vm.attackerHealth <= 0 || vm.defenderHealth <= 0) {
                if (vm.attackerHealth <= 0 && vm.defenderHealth > 0) {
                    vm.result = vm.defenderName + ' has defeated ' + vm.attackerName + ' after ' + vm.messages.length + ' rounds.';
                    vm.attackerHealth = 0;
                    vm.attackerHealthpoints = 0;
                    vm.isWon = false;
                } else if (vm.attackerHealth > 0 && vm.defenderHealth <= 0) {
                    vm.result = vm.attackerName + ' has defeated ' + vm.defenderName + ' after ' + vm.messages.length + ' rounds.';
                    vm.defenderHealth = 0;
                    vm.defenderHealthpoints = 0;
                    vm.isWon = true;
                } else {
                    vm.result = 'The fight went undecided.';
                    vm.attackerHealth = 0;
                    vm.defenderHealth = 0;
                    vm.attackerHealthpoints = 0;
                    vm.defenderHealthpoints = 0;
                }

                clearInterval(fight);
                vm.isOver = true;
            }
        }, 500);
    }
  }
});