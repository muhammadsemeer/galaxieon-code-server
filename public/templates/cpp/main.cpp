#include <iostream>

using namespace std;

int main()
{
    string welcome = "Welcome to Galaxieon Code";
    setbuf(stdout, NULL); // Must Need Before/After Variable declaration OtherWise complier will not give the expected output
    cout << welcome;
    return 0;
}