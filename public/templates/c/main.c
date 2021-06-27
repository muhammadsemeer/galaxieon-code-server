#include <stdio.h>

int main()
{
    setbuf(stdout, NULL); // Must Need Before Variable declaration OtherWise complier will not give the expected output
    printf("Hello World!");
    return 0;
}