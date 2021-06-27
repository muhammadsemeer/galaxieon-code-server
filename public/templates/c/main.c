#include <stdio.h>

int main()
{
    char welcome[100] = "Welcome to Galaxieon Code";
    setbuf(stdout, NULL); // Must Need Before/After Variable declaration OtherWise complier will not give the expected output
    printf("%s", welcome);
    return 0;
}