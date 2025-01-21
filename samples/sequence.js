#!run

export function main() {
    // Generate a sequence of 100 random 0s or 1s
    const sequence = Array.from({ length: 400 }, () => Math.floor(Math.random() * 2));
    
    
    // Print the sequence in a 20x5 grid format
    for (let i = 0; i < sequence.length; i += 20) {
        this.echo(sequence.slice(i, i + 20).join(""));
    }
    
    console.log("Generated sequence:", sequence.join(""));

    // For every n > 1, count the number of n-length subsequences of the same number
    for (let n = 2; n <= sequence.length; n++) {
        let count = 0;

        for (let i = 0; i <= sequence.length - n; i++) {
            const subsequence = sequence.slice(i, i + n);
            if (subsequence.every(num => num === subsequence[0])) {
                count++;
            }
        }
        if(count>0)
        this.echo(`# of ${n}-len seq of same num: ${count}`);
    }
}
/*
F5: run
F1: switch session(buffer)
*/