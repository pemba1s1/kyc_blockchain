function maxint() {
  // eslint-disable-next-line
    let bits = 1
    let prev = 0
    let sumM1 = 1
    let sum = 2

    while (parseInt(sumM1) < parseInt(sum)) {
        bits++
        prev = sum
        sumM1 = parseInt(sumM1 + sum)
        sum = parseInt(sumM1 + 1)
    }
    return parseInt(prev - 1)
}

let MAX_INT = maxint()

const PowerMod = (x, p, N)=>
// Compute x^p mod N
{
    let A = 1
    let m = p
    let t = x

    while (m > 0) {
    let k = Math.floor(m / 2)
    let r = m - 2 * k
    if (r === 1)
        A = (A * t) % N
    t = (t * t) % N
    m = k
    }
    return A
}

const gcd = (a, b) => {
    let R;
    while ((a % b) > 0) {
    R = a % b;
    a = b;
    b = R;
    }
    return b;
}

export const getKey = () => {
    let p = 907
    let q = 773
    let n = p*q
    let e = 2
    let k = 1
    let phi = (p-1)*(q-1)
    let d
    while (e < phi) {
        if (gcd(phi, e) === 1) {
          break;
        } else {
          e++;
        }
    }
    while (true) {
        d = (((k) * (phi) + 1) / (e));
        if (Number.isInteger(d)) {
          break;
        } else {
          k++;
        }
  
    }
    return [e,d,n]
}

export const encrypt = (s,e,n) => {
    let blocksize = 0;
	let max = 255;

	while (max < n && max < MAX_INT) {
	  max = 1001 * max
	  blocksize++
	}

    let i = 0
	let j
	let t
	let M = ""
	while (i < s.length) {
	  for (j = 0; j < blocksize && i < s.length; j++) {
	    t = s.charCodeAt(i)
	    // add leading 0 as necessary so blocks have uniform size
	    if (t < 100)
	      t = "0" + t
	    M += t
	    i++
	  }
	  M += " "
	}

    let c = ""
	let m
	i = 0
	while (i < M.length) {
	  m = M.substr(i, 3 * blocksize)
	  // remove leading 0 if necessary so JavaScript doesn't get confused
	  // when it tries to understand the number
	  while (m.substr(0, 1) === "0")
	    m = m.substr(1, m.length - 1)
	  i += 1 + parseInt(3 * blocksize)
	  c += PowerMod(parseInt(m), e, n) + " "
	}
    return c
}

export const decrypt = (c,d,n) => {
    while (c[c.length - 1] === " ")
        c = c.substring(0, c.length - 1)

    let t = ""
    let i
    let re = /\s+/

    // eslint-disable-next-line
    let codeList = new Array()
    codeList = c.split(re)

    for (i = 0; i < codeList.length; i++)
        t += PowerMod(parseInt(codeList[i]), d, n) + " "


    i = 0
    let M = ""
    let width
    while (t.length > 0) {
        let pos = t.indexOf(" ")
        let m = t.substr(0, pos)

        while (m.length > 0) {
        if (m.length % 3 === 0)
            width = 3
        else
            width = 2

        let s = m.substr(0, width)
        // remove leading 0 if necessary so JavaScript doesn't get confused
        // when it tries to understand the number
        while (s[0] === "0")
            s = s.substr(1, s.length - 1)
        M+= String.fromCharCode(s)
        m = m.substring(width, m.length)
        }

        t = t.substring(pos + 1, t.length)
    }
    return M
}