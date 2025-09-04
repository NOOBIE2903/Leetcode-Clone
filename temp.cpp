#include <bits/stdc++.h>
using namespace std;

vector<string> crypt_rev;
map<char, bool> is_leading_char;
map<char, int> char_to_val;
vector<bool> used_digits;
int max_len;

int solve(int col, int carry) {
    if (col == max_len) {
        return carry == 0 ? 1 : 0;
    }

    char c1 = (col < crypt_rev[0].length()) ? crypt_rev[0][col] : ' ';
    char c2 = (col < crypt_rev[1].length()) ? crypt_rev[1][col] : ' ';
    char c3 = crypt_rev[2][col];

    vector<char> unique_unassigned_chars;
    vector<char> temp;

    if (c1 != ' ' && char_to_val.find(c1) == char_to_val.end()) temp.push_back(c1);
    if (c2 != ' ' && char_to_val.find(c2) == char_to_val.end()) temp.push_back(c2);
    if (c3 != ' ' && char_to_val.find(c3) == char_to_val.end()) temp.push_back(c3);
    
    if (!temp.empty()) {
        sort(temp.begin(), temp.end());
        unique_unassigned_chars.push_back(temp[0]);
        for (size_t i = 1; i < temp.size(); ++i) {
            if (temp[i] != temp[i - 1]) {
                unique_unassigned_chars.push_back(temp[i]);
            }
        }
    }
    
    int count = 0;
    
    function<void(int)> assign_and_check = [&](int k) {
        if (k == (int)unique_unassigned_chars.size()) {
            int v1 = (c1 == ' ') ? 0 : char_to_val.at(c1);
            int v2 = (c2 == ' ') ? 0 : char_to_val.at(c2);
            int v3 = char_to_val.at(c3);

            if ((v1 + v2 + carry) % 10 == v3) {
                int next_carry = (v1 + v2 + carry) / 10;
                count += solve(col + 1, next_carry);
            }
            return;
        }

        char current_char = unique_unassigned_chars[k];
        for (int digit = 0; digit <= 9; ++digit) {
            if (!used_digits[digit]) {
                if (digit == 0 && is_leading_char.count(current_char)) {
                    continue;
                }
                char_to_val[current_char] = digit;
                used_digits[digit] = true;
                assign_and_check(k + 1);
                used_digits[digit] = false;
                char_to_val.erase(current_char);
            }
        }
    };
    
    assign_and_check(0);
    return count;
}

int solution(vector<string> crypt) {
    crypt_rev = crypt;
    used_digits.assign(10, false);
    is_leading_char.clear();
    char_to_val.clear();

    map<char, int> unique_chars_map;
    for (const auto& word : crypt) {
        if (word.length() > 1) {
            is_leading_char[word[0]] = true;
        }
        for (char c : word) {
            unique_chars_map[c] = 1;
        }
    }
    
    if (unique_chars_map.size() > 10) return 0;

    max_len = 0;
    for (string& word : crypt_rev) {
        reverse(word.begin(), word.end());
        if (word.length() > max_len) {
            max_len = word.length();
        }
    }
    
    if (crypt[2].length() < crypt[0].length() || 
        crypt[2].length() < crypt[1].length() ||
        crypt[2].length() > max((int)crypt[0].length(), (int)crypt[1].length()) + 1) {
        return 0;
    }

    return solve(0, 0);
}

int main() {
    vector<string> crypt = {"SEND", "MORE", "MONEY"};
    cout << "Number of solutions: " << solution(crypt) << endl;
    return 0;
}
