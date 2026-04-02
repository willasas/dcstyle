import pandas as pd

# 读取Excel文件
excel_file = 'src/fonts/fonts2.xlsx'

try:
    # 读取所有工作表
    all_sheets = pd.read_excel(excel_file, sheet_name=None)
    
    print("Excel文件包含的工作表:")
    for sheet_name in all_sheets.keys():
        print(f"- {sheet_name}")
    
    # 读取第一个工作表的数据
    first_sheet_name = list(all_sheets.keys())[0]
    df = all_sheets[first_sheet_name]
    
    print(f"\n第一个工作表 '{first_sheet_name}' 的数据:")
    print(df.head())
    
    # 保存数据到临时文件以便查看
    df.to_csv('fonts_data.csv', index=False)
    print("\n数据已保存到 fonts_data.csv")
    
except Exception as e:
    print(f"读取Excel文件时出错: {e}")