import fs from 'fs'

export const readText = async (path) => {
    try {
        const readstr = await fs.promises.readFile(path, 'utf8')
        console.log("Read finished: ", path);
        return readstr;
    } catch (err) {
        console.error('Read error:', err)
    }
}
