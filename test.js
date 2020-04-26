var code = `

// This ins a demo.
print "Con" + "Cat" + "En" + "Ation"

var first = "Jimmy"
var last = "Carter"

if first = "Jimmy"
	if last = "Carter"
		print "Welcome, " + first + " " + last + "!"
`;

run(code.split("\n"));

function run(code) {
	var memory = {
		variable: {}
	}

	var pass = false;
	var pastIndent = -1;
	for (var l = 0; l < code.length; l++) {
		var indent = getIndent(code[l]);
		var split = indent[1].split(" ");
		var command = split[0];

		// Length of the command itself, plus the space.
		// Then extract contents after command
		var lengthToContent = command.length + 1;
		var lineContent = indent[1].substring(lengthToContent);

		var test = {
			print: split[0] == "print",
			var: split[0] == "var",
			if: split[0] == "if",
			printv: split[0] == "printv",
		}

		// If pass == true, then keep skipping lines until we get
		// the last indent when statement was issued
		if (pass) {
			if (pastIndent == indent[0]) {
                pass = false;

				// Tell interpreter to go back and parse current line
				// if indent is dropped back down. Messy solution, but works.
				l--;
            }
		} else {
			if (test["print"]) {
                console.log(parseString(lineContent, memory));
            } else if (split[2] == "=") {
				if (test["if"] || test["var"]) {

					var equalSign = lineContent.split(" = ");
					var name = equalSign[0];
					var value = equalSign[1];

					if (test["if"]) {
						var condition = validateCondition(lineContent, memory);

						// If false, tell interpreter to pass until indent is dropped back
                    	if (!condition) {
							pass = true;
                    		pastIndent = indent[0];
						}
                	} else if (test["var"]) {
						memory.variable[name] = parseString(value);
					} else if (test["input"]) {
						memory.variable[name] = input(value);
					}
            	}
			}
		}
	}
}

function parseString(string, memory) {
	var splitPlus = string.split(" + ");

	var newString = "";
	for (var i = 0; i < splitPlus.length; i++) {
		var current = splitPlus[i];

		// Check if surrounded by ", then substring the innards
 		if (current[0] == '"' && current[current.length - 1] == '"') {
			newString += current.substring(1, current.length - 1);
		} else {
			newString += memory.variable[current];
		}
	}

	return newString;
}

function validateCondition(condition, memory) {
	var split = condition.split(" ")
	if (split[1] == "=") {
		var splitSign = condition.split(" = ");

		var variable = memory.variable[splitSign[0]];
		var value = parseString(splitSign[1], memory);

		if (variable == value) {
			return true;
		} else {
			return false;
		}
	}
}

// Rely on JS substring for this
function getIndent(line) {
	var split = line.split("	");

	indents = 0;
	withoutIndent = "";
	for (var c = 0; c < split.length; c++) {
		if (split[c] == "") {
			indents++;
		} else {
			break;
		}
	}

	return [
		indents,
		line.substring(indents)
	];

}
