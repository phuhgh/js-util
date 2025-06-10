import { stringCountOccurrences, stringCreateHorspoolTable, stringSearchInHorspool } from "./string-boyer-moore-horspool.js";

describe("=> Boyer-Moore-Horspool Search", () =>
{
    function find(needle: string, haystack: string, startIndex: number = 0): number
    {
        const needleObj = stringCreateHorspoolTable(needle);
        return stringSearchInHorspool(haystack, needleObj, startIndex);
    }

    it("| returns -1 if the needle (1 character) cannot be found", () =>
    {
        expect(find("0", "123456789")).toBe(-1);
        expect(find("x", "hello world")).toBe(-1);
    });

    it("| returns -1 if the needle (2 different characters) cannot be found", () =>
    {
        expect(find("ab", "123456789")).toBe(-1);
        expect(find("ab", "a23456789")).toBe(-1);
        expect(find("ab", "1a3456789")).toBe(-1);
        expect(find("ab", "1b3456789")).toBe(-1);
        expect(find("ab", "123b56789")).toBe(-1);
        expect(find("ab", "12a456789")).toBe(-1);
        expect(find("ab", "12a45678a")).toBe(-1);
        expect(find("ab", "12a45678aa")).toBe(-1);
    });

    it("| returns -1 if the needle (2 identical characters) cannot be found", () =>
    {
        expect(find("aa", "123456789")).toBe(-1);
        expect(find("aa", "a23456789")).toBe(-1);
        expect(find("aa", "1a3456789")).toBe(-1);
        expect(find("aa", "12a4a6789")).toBe(-1);
        expect(find("aa", "12a4a678a")).toBe(-1);
        expect(find("aa", "12a4a678ba")).toBe(-1);
    });

    it("| searching in an empty string always fails", () =>
    {
        expect(find("1", "")).toBe(-1);
        expect(find("abc", "")).toBe(-1);
        expect(find("hello world", "")).toBe(-1);
    });

    it("| searching for a needle that's larger than the haystack always fails", () =>
    {
        expect(find("ab", "a")).toBe(-1);
        expect(find("hello", "hm")).toBe(-1);
        expect(find("hello my world!", "this is small")).toBe(-1);
    });

    it("| returns the position at which the needle is first found (1 character needle)", () =>
    {
        expect(find("1", "1234567891")).toBe(0);
        expect(find("2", "1234567892")).toBe(1);
        expect(find("8", "1234567898")).toBe(7);
        expect(find("9", "1234567899")).toBe(8);
    });

    it("| returns the position at which the needle is first found (2 different character needle)", () =>
    {
        expect(find("ab", "ab3456789ab")).toBe(0);
        expect(find("ab", "1ab456789ab")).toBe(1);
        expect(find("ab", "12ab56789ab")).toBe(2);
        expect(find("ab", "123ab6789ab")).toBe(3);

        expect(find("ab", "bbab3456789ab")).toBe(2);
        expect(find("ab", "bb1ab456789ab")).toBe(3);
        expect(find("ab", "bb12ab56789ab")).toBe(4);
        expect(find("ab", "bb123ab6789ab")).toBe(5);

        expect(find("ab", "baab3456789ab")).toBe(2);
        expect(find("ab", "ba1ab456789ab")).toBe(3);
        expect(find("ab", "ba12ab56789ab")).toBe(4);
        expect(find("ab", "ba123ab6789ab")).toBe(5);

        expect(find("ab", "003456789ab")).toBe(9);
        expect(find("ab", "100456789aabab")).toBe(10);
        expect(find("ab", "120056789abbab")).toBe(9);
    });

    it("| returns the position at which the needle is found (2 identical character needle)", () =>
    {
        expect(find("\n\n", "\n\nhello world\n\n")).toBe(0);
        expect(find("\n\n", "h\n\nello world")).toBe(1);
        expect(find("\n\n", "he\n\nllo world")).toBe(2);
        expect(find("\n\n", "hel\n\nllo world")).toBe(3);
        expect(find("\n\n", "hell\n\nlo world")).toBe(4);
        expect(find("\n\n", "hello\n\nworld\n\n")).toBe(5);
        expect(find("\n\n", "\nhello\n\nworld\n\n")).toBe(6);
        expect(find("\n\n", "h\nello\n\nworld\n\n")).toBe(6);
    });

    it("| handles miscellaneous test cases", () =>
    {
        expect(find("hello", "hello world")).toBe(0);
        expect(find("hello", "helo world")).toBe(-1);
        expect(find("hello world!", "oh my, hello world")).toBe(-1);
        expect(find("hello world!", "oh my, hello world!! again, hello world!!")).toBe(7);

        expect(find(
            "\r\n--boundary\r\n",
            "some binary data\r\n" +
            "--boundary\rnot really\r\n" +
            "more binary data\r\n" +
            "--boundary\r\n"
        )).toBe(57);
    });

    it("| is case sensitive", () =>
    {
        const haystack = "Hello World";
        expect(find("WORLD", haystack)).toBe(-1);
        expect(find("World", haystack)).toBe(6);
    });

    it("| handles repeated characters", () =>
    {
        expect(find("AABA", "AABAABAA")).toBe(0);
    });

    it("| handles special characters", () =>
    {
        expect(find("@#$", "Hello! @#$%^")).toBe(7);
    });

    it("| handles emojis", () =>
    {
        expect(find("😜", "Hello! 😜world")).toBe(7);
    });

    it("| respects the start index", () =>
    {
        // single character needles are a special case
        expect(find("a", "abaa", 0)).toBe(0);
        expect(find("a", "abaa", 1)).toBe(2);
        // multi character handled separately
        expect(find("aa", "aabaa", 0)).toBe(0);
        expect(find("aa", "aabbaa", 2)).toBe(4);
    });
});

describe("=> Boyer-Moore-Horspool Count Occurrences", () =>
{
    function count(needle: string, haystack: string, startIndex: number = 0): number
    {
        const needleObj = stringCreateHorspoolTable(needle);
        return stringCountOccurrences(haystack, needleObj, startIndex);
    }

    it("| counts multiple non-overlapping occurrences", () =>
    {
        expect(count("ab", "abababab")).toBe(4);
        expect(count("test", "test1test2test")).toBe(3);
    });

    it("| counts overlapping occurrences", () =>
    {
        expect(count("aa", "aaaa")).toBe(3);
        expect(count("aaa", "aaaa")).toBe(2);
    });

    it("| respects start index", () =>
    {
        expect(count("ab", "ababab", 2)).toBe(2);
        expect(count("test", "test1test2test", 5)).toBe(2);
    });
});